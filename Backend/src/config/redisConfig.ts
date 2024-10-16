import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config(); 

export const redisClient = createClient({
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