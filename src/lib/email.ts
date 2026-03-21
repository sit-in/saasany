import { Resend } from "resend";
import { welcomeEmailHtml } from "@/components/emails/welcome-email";
import { subscriptionEmailHtml } from "@/components/emails/subscription-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "Sassany <noreply@sassany.com>";

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Welcome to Sassany, ${name}!`,
      html: welcomeEmailHtml({ name }),
    });

    if (error) {
      console.error("[email] sendWelcomeEmail error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] sendWelcomeEmail exception:", message);
    return { success: false, error: message };
  }
}

export async function sendSubscriptionEmail(
  to: string,
  name: string,
  plan: string,
  renewalDate?: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Your ${plan} subscription is confirmed`,
      html: subscriptionEmailHtml({ name, plan, renewalDate }),
    });

    if (error) {
      console.error("[email] sendSubscriptionEmail error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] sendSubscriptionEmail exception:", message);
    return { success: false, error: message };
  }
}
