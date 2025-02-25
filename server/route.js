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

    //Because username is not compulsory
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

//Signin
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

      user = await users.findOne({ _id: result.insertedId });
    }

    return res.status(200).json({
      id: user._id,
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

//Get /journals
router.get("/journals", async (req, res) => {
  try {
    const userId = req.query.userId; // Changed to lowercase 'd'
    const isFavourite = req.query.isFavourite;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const collection = getJournalCollection();

    const query = { userId };

    if (isFavourite !== undefined) {
      query.isFavourite = isFavourite === "true";
    }

    const journals = await collection.find(query).toArray();

    const result = journals.map((journal) => ({
      _id: journal._id,
      title: journal.title,
      content: journal.content,
      createdAt: journal.createdAt,
      status: journal.status,
      isFavourite: journal.isFavourite,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message, // Add detailed error info
    });
  }
});

//POST /journal
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
      isFavourite: false,
    });

    res.status(200).json({
      success: true,
      title,
      content,
      userId,
      status: false,
      isFavourite: false,
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


//Make journal a favourite journal by Id
router.patch("/journals/:id", async (req, res) => {
  const journalId = req.params.id;
  const updates = req.body;
  const collection = getJournalCollection();

  try {
    const objectId = new ObjectId(journalId);
    
    // First check if the journal exists
    const existingJournal = await collection.findOne({ _id: objectId });
    
    if (!existingJournal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updates }
    );

    if (result.matchedCount === 1) {  // Changed from modifiedCount to matchedCount
      const updatedJournal = await collection.findOne({ _id: objectId });
      res.status(200).json({ 
        message: "Journal retrieved successfully", 
        journal: updatedJournal,
        // Add a note if no changes were needed
        unchanged: result.modifiedCount === 0
      });
    } else {
      res.status(404).json({ error: "Journal not found" });
    }
  } catch (error) {
    if (error.message.includes('ObjectId')) {
      return res.status(400).json({ 
        error: "Invalid journal ID format" 
      });
    }
    console.error("Error updating journal:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});