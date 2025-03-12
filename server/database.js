//enable us use secret information, from secret file
require("dotenv").config()

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI ||  "mongodb://localhost:25172/";



const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }, tls: true,
};

let client;
let db;

const connectToMongoDB = async () => {
    if (!client) {
      try {
        client = await MongoClient.connect(uri, options);
        db = client.db('journaldb'); 
      } catch (error) {
        console.log(error);
        throw error; 
      }
    }
    return client;
  };

const getDb = () => {
    if(!db){
        throw new Error("Database not connected. Please connect to database first");
    }
    return db;
};

const getConnectedClient = () => client;
module.exports = { getDb, getConnectedClient, connectToMongoDB }