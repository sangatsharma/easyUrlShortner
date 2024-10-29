"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encodedToken = req.cookies.token;
        if (!encodedToken) {
            res
                .status(401)
                .json({ success: false, message: "Unauthorized: No token provided" });
            return;
        }
        // Decode the token to get the original JWT
        const token = decodeURIComponent(encodedToken);
        // Verify token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach decoded token to the request (optional, if you need it later)
        res.locals.user = decodedToken;
        // If token is valid, proceed to the next middleware/route handler
        next();
    }
    catch (error) {
        console.log("Error in authenticating user: ", error);
        res
            .status(401)
            .json({ success: false, message: "Unauthorized: Invalid token" });
        return;
    }
});
exports.authenticateJWT = authenticateJWT;
