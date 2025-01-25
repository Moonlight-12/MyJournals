const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("journaldb").collection("journal")
    return collection
}

// GET /journal
router.get("/journals", async (req, res) => {
    const collection = getCollection();
    const journal = await collection.find({}).toArray();

    res.status(200).json(journal);
});

//POST /journal
router.post("/journals", async (req, res) => {
    const collection = getCollection();
    // const { journal } = req.body;

    console.log(req.body);

    res.status(200).json({ mssg: "POST request to /api/journals" });
});

//DELETE /journal/:id
router.delete("/journals/:id", (req, res) => {
  res.status(200).json({ mssg: "DELETE request to /api/journals:id" });
});

//PUT /journal/:id
router.put("/journals/:id", (req, res) => {
  res.status(200).json({ mssg: "PUT request to /api/journals:id" });
});

module.exports = router;
