"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = void 0;
const nanoid_1 = require("nanoid");
const generateVerificationToken = (length = 6) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const alphanumericNanoid = (0, nanoid_1.customAlphabet)(alphabet, length); // Length of the ID
    const token = alphanumericNanoid();
    console.log(token);
    return token;
};
exports.generateVerificationToken = generateVerificationToken;
