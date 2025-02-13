require("dotenv/lib/main").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

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
