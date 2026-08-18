import nodemailer from "nodemailer";
import { env } from "../../config/env.service";

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.googleAppEmail,
        pass: env.googleAppPassword,
    },
});

export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ Email service connected");
    } catch (error) {
        console.error("❌ Email service connection failed:", error);
        process.exit(1);
    }
};

export const sendEmail = async (
    { to, subject, html }: SendEmailOptions,
    retries = 2,
): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: env.emailSenderName,
            to,
            subject,
            html,
        });
        console.log("Email sent:", info.accepted);
    } catch (error) {
        if (retries > 0) {
            console.warn(`Email send failed, retrying... (${retries} left)`);
            await sendEmail({ to, subject, html }, retries - 1);
            return;
        }
        console.error("Failed to send email after retries:", error);
        throw new Error("Failed to send email");
    }
};