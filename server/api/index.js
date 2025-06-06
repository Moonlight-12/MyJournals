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

// Connect to MongoDB (this will run on each serverless function call)
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongoDB();
    isConnected = true;
  }
  next();
});

app.use("/api", router);

// Export for Vercel serverless functions
export default app;