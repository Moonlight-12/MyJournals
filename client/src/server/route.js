const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb/mongodb");

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

app.post('/api/auth/github', async (req, res) => {
  const { githubId, email, name } = req.body;
  
  // Check if user exists by githubId
  let user = await User.findOne({ githubId });
  
  // Create new user if doesn't exist
  if (!user) {
    user = new User({ githubId, email, name });
    await user.save();
  }
  
  // Generate JWT token for backend authentication
  const token = generateJWT(user);
  
  res.json({ token });
});

router.post("/auth/signin", async (req, res) => {
  console.log("📩 Received login request:", req.body);

  const { email, password } = req.body;
  const users = getUserCollection();

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
  }

  const user = await users.findOne({ email });
  console.log("🔍 Found user:", user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error("❌ Invalid login for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
  }

  console.log("✅ User authenticated:", user);
  res.status(200).json(user);
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
      userId: String(userId),
      createdAt: new Date(),
      status: false,
    });

    res.status(200).json({
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
