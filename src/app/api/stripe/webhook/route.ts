import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

/**
 * Stripe Webhook 处理器。
 * 注意：此路由不能有认证中间件，Stripe 需要直接访问。
 * raw body 通过 request.text() 获取以验证签名。
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("[stripe/webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (checkoutSession.mode !== "subscription") break;

        const stripeSubscriptionId = checkoutSession.subscription as string;
        const stripeCustomerId = checkoutSession.customer as string;
        const userId = checkoutSession.metadata?.userId;

        if (!userId) {
          console.error("[stripe/webhook] No userId in checkout session metadata");
          break;
        }

        // 获取订阅详情
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const firstItem = stripeSubscription.items.data[0];
        const priceId = firstItem?.price.id ?? null;
        // stripe@20.x (API clover): current_period_start/end 在 SubscriptionItem 上
        const currentPeriodStart = firstItem?.current_period_start != null
          ? new Date(firstItem.current_period_start * 1000)
          : null;
        const currentPeriodEnd = firstItem?.current_period_end != null
          ? new Date(firstItem.current_period_end * 1000)
          : null;

        // 检查是否已有订阅记录
        const existing = await db
          .select()
          .from(subscription)
          .where(eq(subscription.userId, userId))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(subscription)
            .set({
              stripeCustomerId,
              stripeSubscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodStart: currentPeriodStart,
              stripeCurrentPeriodEnd: currentPeriodEnd,
              status: stripeSubscription.status,
              plan: "pro",
              updatedAt: new Date(),
            })
            .where(eq(subscription.userId, userId));
        } else {
          await db.insert(subscription).values({
            id: randomUUID(),
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodStart: currentPeriodStart,
            stripeCurrentPeriodEnd: currentPeriodEnd,
            status: stripeSubscription.status,
            plan: "pro",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const userId = stripeSubscription.metadata?.userId;

        if (!userId) {
          // 通过 stripeSubscriptionId 查找
          const existing = await db
            .select()
            .from(subscription)
            .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
            .limit(1);

          if (existing.length === 0) {
            console.error("[stripe/webhook] Subscription not found:", stripeSubscription.id);
            break;
          }
        }

        const updatedFirstItem = stripeSubscription.items.data[0];
        const priceId = updatedFirstItem?.price.id ?? null;
        // stripe@20.x: current_period_start/end 在 SubscriptionItem 上
        const currentPeriodStart = updatedFirstItem?.current_period_start != null
          ? new Date(updatedFirstItem.current_period_start * 1000)
          : null;
        const currentPeriodEnd = updatedFirstItem?.current_period_end != null
          ? new Date(updatedFirstItem.current_period_end * 1000)
          : null;

        const isCanceled =
          stripeSubscription.status === "canceled" ||
          stripeSubscription.cancel_at_period_end;

        await db
          .update(subscription)
          .set({
            stripePriceId: priceId,
            stripeCurrentPeriodStart: currentPeriodStart,
            stripeCurrentPeriodEnd: currentPeriodEnd,
            status: stripeSubscription.status,
            plan: isCanceled ? "free" : "pro",
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        await db
          .update(subscription)
          .set({
            status: "canceled",
            plan: "free",
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));

        break;
      }

      default:
        // 忽略其他事件
        break;
    }
  } catch (error) {
    console.error("[stripe/webhook] Handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
