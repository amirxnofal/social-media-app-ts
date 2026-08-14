import bcrypt from "bcrypt";
import { env } from "../../config/env.service";

export const hashText = async ({
    plainText,
    salt = env.saltRound,
}: {
    plainText: string;
    salt?: string;
}): Promise<string> => {
    return await bcrypt.hash(plainText, Number(env.saltRound));
};

export const compareText = async ({
    plainText,
    cypherText,
}: {
    plainText: string;
    cypherText: string;
}): Promise<boolean> => {
    return await bcrypt.compare(plainText, cypherText);
};
