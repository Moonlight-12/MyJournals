const express = require("express");

const app = express()

app.get("/hello", (req, res) => {
    res.status(200).json({mssg: "hello people"})
});

const port = 8000;

app.listen (port, () => {
    console.log(`server is listening on port http://localhost:${port}`)
});

