"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const easyUrlroutes_1 = __importDefault(require("./routes/easyUrlroutes"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
//middleware to parse incoming JSON payloads and makes them available on req.body.
app.use(express_1.default.json());
//handles URL-encoded data
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: `${process.env.MODE}`,
    credentials: true,
}));
app.use("/", easyUrlroutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
