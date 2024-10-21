import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/dbConfig";
import easyUrlRoutes from "./routes/easyurl.routes";
import userRoutes from "./routes/user.routes";
import {
  getRedisStatus,
  redisClient,
  setRedisStatus,
} from "./config/redisConfig";

dotenv.config();
connectDb();

redisClient
  .connect()
  .then(() => {
    setRedisStatus(true);
    console.log("Connected to Redis:", getRedisStatus());
  })
  .catch((err) => {
    setRedisStatus(false);
    console.error("Redis connection error:", err);
    //console.error("Redis connection error:", err);
  });

redisClient.on("end", () => {
  console.log("Redis connection closed. Attempting to reconnect...");
  setTimeout(
    () =>
      redisClient
        .connect()
        .then(() => {
          setRedisStatus(true);
          console.log("Connected to Redis:", getRedisStatus());
        })
        .catch((err) => {
          setRedisStatus(false);
          console.error("Redis connection error:", err);
          //console.error("Redis connection error:", err);
        }),
    1000
  ); // Reconnect after 1 second
});

const PORT = process.env.PORT || 5000;
const app = express();
//middleware to parse incoming JSON payloads and makes them available on req.body.
app.use(express.json());
app.use(cookieParser());
//handles URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://www.easyurl.me",
      "https://easyurl.me",
    ],
    credentials: true,
  })
);
app.use("/", easyUrlRoutes);
app.use("/user", userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
