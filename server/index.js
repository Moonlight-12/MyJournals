const express = require("express");
const app = express();

const router = require("./route");
app.use("/api", router);

const port = 4000;
app.listen (port, () => {
    console.log(`server is listening on port http://localhost:${port}`)
});

