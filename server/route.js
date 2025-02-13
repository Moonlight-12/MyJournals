const express = require("express");
const bcrypt = require("bcryptjs");
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
  return collection;
};

//Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, createdAt } = req.body;

    const safeUsername = username || null;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = getUserCollection();

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.insertOne({
      email,
      password: hashedPassword,
      username: safeUsername,
      createdAt,
    });
    return res.status(200).json({
      success: true,
      userId: newUser.insertedId,
      message: "User Created Successfuly",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/auth/signin", async (req, res) => {
  const { email, password, provider } = req.body;
  const users = getUserCollection();

  if (provider === "github") {
    let user = await users.findOne({ email });

    if (!user) {
      const result = await users.insertOne({
        email,
        username: email.split("@")[0],
        createdAt: new Date(),
      });

      // Fetch the newly inserted user to return the full document
      user = await users.findOne({ _id: result.insertedId });
    }

    return res.status(200).json({
      id: user._id,  // ✅ Return the MongoDB `_id`
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await users.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.status(200).json({
    id: user._id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  });
});

// GET /journal
router.get("/journals", async (req, res) => {
  const collection = getJournalCollection();
  //   const userId = new ObjectId(req.query.userID);
  //   const journals = await collection.find({ userId }).toArray();
  const journals = await collection.find({}).toArray();

  const result = journals.map((journal) => ({
    title: journal.title,
    content: journal.content,
  }));

  res.status(200).json(result);
});

//POST /journal
//need to implement userID later
router.post("/journals", async (req, res) => {
  const collection = getJournalCollection();
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, mssg: "missing required fields" });
  }

  try {
    const newJournal = await collection.insertOne({
      title,
      content,
      userId,
      createdAt: new Date(),
      status: false,
    });

    res.status(200).json({
      success: true,
      title,
      content,
      userId,
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
