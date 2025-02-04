const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getJournalCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("journaldb").collection("journal");
  return collection;
};

const getUserCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("journaldb").collection("users");
};

//Registration
router.post("/register", async (req, res) => {
    const {email, password} = req.body;
    const users = getUserCollection();

    const existingUser = await users.findOne({email});
    if (existingUser){
        return res.status(400).json({error: "user already exists"});
    }

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const newUser = await users.insertOne({ email, password });
    res.status(200).json({userId: newUser.insertedId});
});

//authentication
router.post("/login", async (req,res) => {
    const { email, password } = req.body;
    const users = getUserCollection();

    const user = await users.findOne({email, password});

    if(!user){
        return res.status(400).json({error: "invalid credentials"})
    }

    res.status(200).json({userId: user._Id})
})

// GET /journal
router.get("/journals", async (req, res) => {
  const collection = getJournalCollection();
  const userId = new ObjectId(req.query.userID);
  const journals = await collection.find({ userId }).toArray();

  const result = journals.map((journal) => ({
    title: journal.title,
    content: journal.content,
  }));

  res.status(200).json(result);
});

//POST /journal
router.post("/journals", async (req, res) => {
  const collection = getJournalCollection();
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ success: false, mssg: "missing required fields" });
  }

  try {
    const newJournal = await collection.insertOne({
      title,
      content,
      userId: new ObjectId(String(userId)),
      createdAt: new Date(),
      status: false,
    });

    res
      .status(200)
      .json({
        success: true,
        title,
        content,
        status: false,
        _id: newJournal.insertedId,
      });
  } catch (error) {
    console.error("Journal creation error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

//DELETE /journal/:id
router.delete("/journals/:id", async (req, res) => {
  const collection = getJournalCollection();
  const _id = new ObjectId(req.params.id);

  const deletedJournal = await collection.deleteOne({ _id });

  res.status(200).json(deletedJournal);
});

//PUT /journal/:id
router.put("/journals/:id", async (req, res) => {
  const collection = getJournalCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;

  if (typeof status !== Boolean) {
    return res.status(400).json({ mss: "invalid status" });
  }

  const updatedJournal = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );

  res.status(200).json(updatedJournal);
});

module.exports = router;
