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
  }, 5000); // Reconnect after 5 second
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
  "http://localhost:5174",
  "http://localhost:5173",
  "https://www.easyurl.me",
  "https://easyurl.me",
  "https://easy-url-frontend.vercel.app",
];

// Define CORS options
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Use CORS middleware with options
app.use(cors(corsOptions));
// OPTIONS route (optional, useful for preflight requests)
app.options("*", cors(corsOptions));

// Routes
app.use("/", easyUrlRoutes);
app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
