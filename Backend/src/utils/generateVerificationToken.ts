import { customAlphabet } from "nanoid";

export const generateVerificationToken = (length:number=6): string => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const alphanumericNanoid = customAlphabet(alphabet, length); // Length of the ID
  const token = alphanumericNanoid();
  console.log(token);
  return token;
};
