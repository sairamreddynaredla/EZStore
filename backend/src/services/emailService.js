import nodemailer from "nodemailer";
import config from "../config/index.js";

const hasSmtpConfig = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const getTransporter = () => {
  if (!hasSmtpConfig()) return null;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || (host && host.includes("gmail") ? 465 : 587);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const buildHtmlTemplate = (resetUrl, toEmail) => {
  const brandColor = "#f97316"; // Orange 500
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>EZStore Password Reset</title>
  </head>
  <body style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; background:#f8f8f8; margin:0; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.06);">
            <tr>
              <td style="text-align:center;padding-bottom:16px;">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:20px;background:${brandColor};color:#fff;font-weight:800;font-size:26px;box-shadow:0 4px 14px rgba(249,115,22,0.35);">EZ</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0 6px;text-align:center;font-size:26px;font-weight:800;color:#111827;">Reset Your Password</td>
            </tr>
            <tr>
              <td style="padding:0 0 24px;text-align:center;color:#4b5563;font-size:16px;line-height:1.6;">
                We received a request to reset the password for <strong>${toEmail}</strong>. Click the button below to choose a new password.
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:12px 0 24px;">
                <a href="${resetUrl}" style="display:inline-block;padding:16px 36px;border-radius:16px;background:${brandColor};color:#fff;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 4px 14px rgba(249,115,22,0.4);">Reset Password</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:12px;color:#6b7280;font-size:14px;text-align:center;line-height:1.5;">
                Or copy and paste this link into your browser:<br/>
                <a href="${resetUrl}" style="color:${brandColor};word-break:break-all;font-weight:600;">${resetUrl}</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:28px;border-top:1px solid #f3f4f6;margin-top:28px;color:#9ca3af;font-size:13px;text-align:center;">
                If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
              </td>
            </tr>
          </table>
          <div style="max-width:600px;margin-top:20px;color:#9ca3af;font-size:12px;text-align:center;">© ${new Date().getFullYear()} EZStore Pet Shop. All rights reserved.</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || `no-reply@ezstore.com`;
  const transporter = getTransporter();
  const subject = "EZStore - Reset Your Password";
  const text = `You requested a password reset for ${toEmail}. Click the following link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`;
  const html = buildHtmlTemplate(resetUrl, toEmail);

  if (!transporter) {
    console.info(`====================================================`);
    console.info(`PASSWORD RESET LINK FOR: ${toEmail}`);
    console.info(`LINK: ${resetUrl}`);
    console.info(`====================================================`);

    // Try sending via free Ethereal test account so email preview link is generated
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail({
        from: '"EZStore Support" <no-reply@ezstore.com>',
        to: toEmail,
        subject,
        text,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.info(`[Email Service] Ethereal Email Preview: ${previewUrl}`);
      return { sent: true, previewUrl, logged: true };
    } catch (err) {
      console.warn("Ethereal test mail fallback error:", err.message);
      return { logged: true };
    }
  }

  const info = await transporter.sendMail({ from, to: toEmail, subject, text, html });
  console.info(`Password reset email successfully sent to ${toEmail}`);
  return { sent: true, info };
};

export default { sendPasswordResetEmail };
