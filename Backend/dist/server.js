"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const easyurl_routes_1 = __importDefault(require("./routes/easyurl.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const redisConfig_1 = require("./config/redisConfig");
dotenv_1.default.config();
(0, dbConfig_1.default)();
redisConfig_1.redisClient
    .connect()
    .then(() => {
    (0, redisConfig_1.setRedisStatus)(true);
    console.log("Connected to Redis:", (0, redisConfig_1.getRedisStatus)());
})
    .catch((err) => {
    (0, redisConfig_1.setRedisStatus)(false);
    console.error("Redis connection error:", err);
    //console.error("Redis connection error:", err);
});
redisConfig_1.redisClient.on("end", () => {
    console.log("Redis connection closed. Attempting to reconnect...");
    setTimeout(() => redisConfig_1.redisClient
        .connect()
        .then(() => {
        (0, redisConfig_1.setRedisStatus)(true);
        console.log("Connected to Redis:", (0, redisConfig_1.getRedisStatus)());
    })
        .catch((err) => {
        (0, redisConfig_1.setRedisStatus)(false);
        console.error("Redis connection error:", err);
        //console.error("Redis connection error:", err);
    }), 1000); // Reconnect after 1 second
});
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
//middleware to parse incoming JSON payloads and makes them available on req.body.
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//handles URL-encoded data
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://www.easyurl.me",
        "https://easyurl.me",
        "https://easy-url-frontend.vercel.app"
    ],
    credentials: true,
}));
app.use("/", easyurl_routes_1.default);
app.use("/user", user_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
