import { clerkClient } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

// Utility to send email (example with nodemailer; replace with your provider if needed)
export async function sendUserEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Configure your SMTP transporter or use a transactional email provider here
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
}
