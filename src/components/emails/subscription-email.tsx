/**
 * Subscription confirmation email HTML template.
 *
 * Usage:
 *   import { subscriptionEmailHtml } from "@/components/emails/subscription-email";
 *   const html = subscriptionEmailHtml({ name: "Alice", plan: "Pro", renewalDate: "April 15, 2025" });
 */

interface SubscriptionEmailProps {
  name: string;
  plan: string;
  renewalDate?: string;
  manageUrl?: string;
}

export function subscriptionEmailHtml({
  name,
  plan,
  renewalDate,
  manageUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`,
}: SubscriptionEmailProps): string {
  const planFeatures: Record<string, string[]> = {
    Pro: [
      "Unlimited projects",
      "50,000 AI requests / month",
      "Priority email support",
      "Advanced authentication",
      "Full analytics dashboard",
      "Custom domain support",
    ],
  };

  const features = planFeatures[plan] ?? [];

  const featureRows = features
    .map(
      (f) => `
    <tr>
      <td style="padding:6px 0;font-size:15px;color:#374151;">
        <span style="color:#16a34a;margin-right:8px;">✓</span>${f}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Subscription Confirmed – Saasany ${plan}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0D9276;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#ffffff;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;line-height:36px;display:inline-block;">⚡</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Saasany</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              <!-- Badge -->
              <div style="display:inline-block;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;padding:4px 14px;margin-bottom:20px;">
                <span style="font-size:13px;font-weight:600;color:#15803d;">Subscription Confirmed</span>
              </div>

              <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.5px;">
                You're on ${plan}, ${name}!
              </h1>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#4b5563;">
                Thank you for upgrading. Your ${plan} plan is now active and all features are unlocked. Here's what's included:
              </p>

              <!-- Features -->
              ${
                features.length > 0
                  ? `<table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;background-color:#f9fafb;border-radius:8px;padding:20px 24px;">
                <tbody>
                  ${featureRows}
                </tbody>
              </table>`
                  : ""
              }

              ${
                renewalDate
                  ? `<p style="margin:0 0 32px;font-size:14px;color:#6b7280;">
                Your subscription renews on <strong style="color:#374151;">${renewalDate}</strong>. You can manage or cancel at any time from your billing page.
              </p>`
                  : ""
              }

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background-color:#0D9276;">
                    <a href="${manageUrl}"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Manage Subscription →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                Questions? Reply to this email or visit
                <a href="${manageUrl.replace('/dashboard/billing', '')}" style="color:#6b7280;text-decoration:underline;">${manageUrl.replace('/dashboard/billing', '').replace('https://', '').replace('http://', '')}</a>.
                You can cancel your subscription at any time — no questions asked.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
