import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:25172/";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  maxPoolSize: 10, // Limit connection pool for serverless
  maxIdleTimeMS: 270000, // Close idle connections after 4.5 minutes (Vercel timeout is 5 min)
};

// Cache connection between serverless function invocations
let cachedClient = null;
let cachedDb = null;

const connectToMongoDB = async () => {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    console.log("Using cached MongoDB connection");
    return cachedClient;
  }

  try {
    // Create new connection
    const client = await MongoClient.connect(uri, options);
    const db = client.db("journaldb");
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    console.log("New connection to MongoDB established");
    
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

const getDb = () => {
  if (!cachedDb) {
    throw new Error("Database not connected. Please connect to database first");
  }
  return cachedDb;
};

const getConnectedClient = () => cachedClient;

export { getDb, getConnectedClient, connectToMongoDB };