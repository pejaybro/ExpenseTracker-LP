import nodemailer from "nodemailer";

/**
 * Create reusable transporter
 * (Use SMTP credentials from env)
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) == 465, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection OK");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err.message);
  }
})();

/**
 * Send verification email with OTP
 */
export const sendVerificationEmail = async ({ to, name, code }) => {
  const mailOptions = {
    from: `"Specely" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Verify your Specely account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello ${name},</h2>

        <p>Thank you for signing up on <b>Specely</b>.</p>

        <p>Please use the verification code below to confirm your account:</p>

        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 20px 0;
        ">
          ${code}
        </div>

        <p>This code will expire in <b>10 minutes</b>.</p>

        <p>If you didn’t create this account, you can safely ignore this email.</p>

        <br />
        <p>— Specely Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async ({ to, name, code }) => {
  const mailOptions = {
    from: `"Specely" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Reset your Specely password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello ${name},</h2>

        <p>We received a request to reset the password for your <b>Specely</b> account.</p>

        <p>Please use the verification code below to reset your password:</p>

        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 20px 0;
        ">
          ${code}
        </div>

        <p>This code will expire in <b>10 minutes</b>.</p>

        <p>
          If you did not request a password reset, please ignore this email.
          Your account will remain secure.
        </p>

        <br />
        <p>— Specely Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

