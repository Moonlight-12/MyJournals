import express from "express";
import { connectToMongoDB } from "../database.js";
import cors from "cors";
import router from "../route.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*", // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Connect to MongoDB
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectToMongoDB();
      isConnected = true;
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// Root route - for when someone visits your domain directly
app.get("/", (req, res) => {
  res.json({ 
    message: "MyJournals API is running!", 
    timestamp: new Date().toISOString(),
    endpoints: {
      api: "/api/*"
    }
  });
});

// API routes - handle requests that come with /api prefix stripped
app.use("/api", router);

// Handle any other routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found", 
    path: req.originalUrl,
    message: "Please check the API documentation for available endpoints" 
  });
});

export default app;