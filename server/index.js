import path from "path";
import dotenv from "dotenv";
import express from "express";
import { connectToMongoDB } from "./database.js";
import cors from "cors";
import router from "./route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? "https://yourdomain.com" 
    : "http://localhost:3000" // Next.js dev server
}));

app.use("/api", router);

const port = process.env.PORT || 4000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`API server is listening on port http://localhost:${port}`);
  });
}

startServer();