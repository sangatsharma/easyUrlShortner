"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_CONNECTION_STRING,
});
// redisClient
//   .connect()
//   .then(async () => {
//     // Example: Store a simple string
//     await redisClient.set("key", "value");
//     const value = await redisClient.get("key");
//     console.log(`Got value: ${value}`);
//     // Example: Store a hash
//     await redisClient.hSet("user-session:123", {
//       name: "John",
//       surname: "Smith",
//       company: "Redis",
//       age: 29,
//     });
//     const userSession = await redisClient.hGetAll("user-session:123");
//     console.log("User Session:", userSession);
//     // Clean up the connection
//     await redisClient.quit();
//     console.log("Connected to Redis");
//   })
//   .catch((err) => {
//     console.log(process.env.REDIS_PORT);
//     console.error("Redis connection error:", err);
//   });
