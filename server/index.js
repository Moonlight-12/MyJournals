require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");

const app = express();

const router = require("./route");
app.use("/api", router);

const port = process.env.PORT || 4000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`server is listening on port http://localhost:${port}`);
  });
}
startServer();
