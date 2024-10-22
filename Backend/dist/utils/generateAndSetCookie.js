"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateAndSetCookie = (res, user) => {
    console.log(process.env.NODE_ENV === "PROD" ? ".easyurl.me" : ".localhost", process.env.NODE_ENV);
    const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "PROD",
        httpOnly: true,
        sameSite: "lax",
        path: "/", // cookie will be sent to all routes
        domain: process.env.NODE_ENV === "PROD" ? "easyurl.me" : ".localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.generateAndSetCookie = generateAndSetCookie;
