/**
 * Welcome email HTML template.
 *
 * Usage:
 *   import { welcomeEmailHtml } from "@/components/emails/welcome-email";
 *   const html = welcomeEmailHtml({ name: "Alice" });
 */

interface WelcomeEmailProps {
  name: string;
  ctaUrl?: string;
}

export function welcomeEmailHtml({
  name,
  ctaUrl = "https://sassany.com/dashboard",
}: WelcomeEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Sassany</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#000000;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#ffffff;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;line-height:36px;display:inline-block;">⚡</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Sassany</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 40px;">
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.5px;">
                Welcome, ${name}!
              </h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4b5563;">
                Your account is ready. Sassany gives you everything you need to build and ship an AI SaaS product — authentication, payments, AI integration, and more — all in one production-ready template.
              </p>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#4b5563;">
                Head over to your dashboard to get started. If you have any questions, just reply to this email — we read every message.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background-color:#000000;">
                    <a href="${ctaUrl}"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.1px;">
                      Go to Dashboard →
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
                You received this email because you created an account at
                <a href="https://sassany.com" style="color:#6b7280;text-decoration:underline;">sassany.com</a>.
                If you did not sign up, you can safely ignore this email.
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
