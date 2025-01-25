const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const {ObjectId} = require("mongodb");

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
    const { journal } = req.body;

    if (!journal){
        return res.status(400).json({mssg: "not joutnal found"});
    }

    journal = JSON.stringify(journal)

    const newJournal = await collection.insertOne({journal, status: false});

    res.status(200).json({ journal, status: false, _id:newJournal.insertedId});
});

//DELETE /journal/:id
router.delete("/journals/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedJournal = await collection.deleteOne({_id});

    res.status(200).json(deletedJournal);
});

//PUT /journal/:id
router.put("/journals/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const {status} = req.body;
    
    if(typeof status !== Boolean){
        return res.status(400).json({mss:"invalid status"})
    }

    const updatedJournal = await collection.updateOne({_id}, { $set: {status: !status}})

  res.status(200).json(updatedJournal);
});

module.exports = router;
