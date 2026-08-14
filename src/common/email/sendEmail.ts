import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { env } from "../../config/env.service";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.googleAppEmail,
        pass: env.googleAppPassword,
    },
});

export const sendEmail = async ({ to, subject, html }: Mail.Options) => {
    const info = await transporter.sendMail({
        from: `${env.emailSenderName}`,
        to,
        subject,
        html,
    });

    console.log("Email send", info.messageId);
};
