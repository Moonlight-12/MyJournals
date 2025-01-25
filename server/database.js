//enable us use secret information, from secret file
require("dotenv").config()

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI ||  "mongodb://localhost:25172/";

const option = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        depreciationErrors: true,
    }
};

let client;

const connectToMongoDB = async () => {
    if (!client){
        try {
            client == await MongoClient.connect(uri, options);
        } catch (error) {
            console.log(error);
        }
    }
    return client;
};

const getConnectedClient = () => client;
module.export = {getConnectedClient, connectToMongoDB}