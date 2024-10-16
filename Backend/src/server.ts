import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/dbConfig";
import easyUrlRoutes from "./routes/easyUrlroutes";
import { redisClient } from "./config/redisConfig";

 let isRedisReady = false;
dotenv.config();
connectDb();
redisClient
  .connect()
  .then(() => {
    isRedisReady = true;
    console.log("Connected to Redis:", isRedisReady);
  })
  .catch((err) => {
    isRedisReady = false;
    console.error("Redis connection error:", isRedisReady);
    //console.error("Redis connection error:", err);
  });
// Function to get the current Redis readiness status
export const getRedisStatus = (): boolean => isRedisReady;

const PORT = process.env.PORT || 5000;
const app = express();
//middleware to parse incoming JSON payloads and makes them available on req.body.
app.use(express.json());
//handles URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.easyurl.me",
      "https://easyurl.me",
    ],
    credentials: true,
  })
);
app.use("/", easyUrlRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
