import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;
const mongodbUri = process.env.MONGODB_URI;
const saltRound = process.env.SALT_ROUND;
const googleAppEmail = process.env.GOOGLE_APP_EMAIL;
const googleAppPassword = process.env.GOOGLE_APP_PASSWORD;
const emailSenderName = process.env.EMAIL_SENDER_NAME;

export const env = {
    port,
    mongodbUri,
    saltRound,
    googleAppEmail,
    googleAppPassword,
    emailSenderName,
    nodeEnv,
};
