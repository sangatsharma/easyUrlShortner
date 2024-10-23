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

dotenv.config(); // Load environment variables
connectDb(); // Connect to the database

// Redis setup with reconnect logic
redisClient
  .connect()
  .then(() => {
    setRedisStatus(true);
    console.log("Connected to Redis:", getRedisStatus());
  })
  .catch((err) => {
    setRedisStatus(false);
    console.error("Redis connection error:", err);
  });

redisClient.on("end", () => {
  console.log("Redis connection closed. Attempting to reconnect...");
  setTimeout(() => {
    redisClient
      .connect()
      .then(() => {
        setRedisStatus(true);
        console.log("Connected to Redis:", getRedisStatus());
      })
      .catch((err) => {
        setRedisStatus(false);
        console.error("Redis reconnection error:", err);
      });
  }, 1000); // Reconnect after 1 second
});

const PORT = process.env.PORT || 5000;
const app = express();

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies in requests
app.use(cookieParser());

// CORS configuration for cross-origin requests
const allowedOrigins = [
  "http://localhost:5175",
  "http://localhost:5173",
  "https://www.easyurl.me",
  "https://easyurl.me",
  "https://easy-url-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins, // Directly pass the array of allowed origins
    credentials: true, // Allow cookies to be sent with requests
  })
);
// Preflight request handling for all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(204); // No Content
});

// Routes
app.use("/", easyUrlRoutes);
app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
