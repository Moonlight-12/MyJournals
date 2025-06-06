import express from "express";
import { connectToMongoDB } from "../database.js";
import cors from "cors";
import router from "../route.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://yourdomain.com", "https://your-frontend-vercel-url.vercel.app"]
    : "http://localhost:3000"
}));

// Connect to MongoDB
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectToMongoDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// Remove the "/api" prefix here - Vercel already handles that routing
app.use("/", router);

// Add a health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running!", timestamp: new Date().toISOString() });
});

// Export for Vercel serverless functions
export default app;