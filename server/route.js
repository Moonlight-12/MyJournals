import express from "express";
import bcrypt from "bcryptjs";
import { getConnectedClient } from "./database.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import authMiddleware from "./authMiddleware.js";
import { updateStreak } from "./streakservice.js";

const router = express.Router();

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.insertOne({
      email,
      password: hashedPassword,
      username: safeUsername,
      createdAt,
      streak: {
        count: 0,
      },
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
  const { name, email, password, provider } = req.body;
  const users = getUserCollection();

  // Function to generate JWT token
  const generateToken = (user) => {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
  };

  if (provider === "github" || provider === "google") {
    let user = await users.findOne({ email });

    if (!user) {
      const result = await users.insertOne({
        email,
        username: name,
        createdAt: new Date(),
        provider: provider,
      });

      user = await users.findOne({ _id: result.insertedId });
    }

    const token = generateToken(user);

    return res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      token, 
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await users.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate token for regular login
  const token = generateToken(user);

  res.status(200).json({
    id: user._id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    token, // Send JWT token
  });
});

//Get /journals
router.get("/journals", async (req, res) => {
  try {
    const userId = req.query.userId;
    const isFavourite = req.query.isFavourite;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const collection = getJournalCollection();

    const query = { userId, isHidden: false };

    if (isFavourite !== undefined) {
      query.isFavourite = isFavourite === "true";
    }

    const journals = await collection.find(query).sort({ createdAt: -1 }).toArray();

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
      message: error.message,
    });
  }
});

router.post("/journals", async (req, res) => {
  const collection = getJournalCollection();
  const { title, content, userId} = req.body;
  console.log("User ID from request:", req.body.userId);
  const currentDate = new Date();

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
      createdAt: currentDate,
      status: false,
      isFavourite: false,
      isHidden: false,
      updatedAt: currentDate,
    });

    const newStreakCount = await updateStreak(userId, currentDate);

    res.status(200).json({
      success: true,
      title,
      content,
      userId,
      status: false,
      isFavourite: false,
      _id: newJournal.insertedId,
      streak: newStreakCount,
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

//Make journal a favourite journal by Id
router.patch("/favourite/:id", authMiddleware, async (req, res) => {
  const journalId = req.params.id;
  const updates = req.body;
  const collection = getJournalCollection();
  const userId = req.user.id; // This should now be a string

  try {
    const existingJournal = await collection.findOne({
      _id: new ObjectId(journalId),
      userId: userId, // String comparison
    });

    if (!existingJournal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    const result = await collection.updateOne(
      {
        _id: new ObjectId(journalId),
        userId: userId,
      },
      { $set: updates }
    );

    if (result.matchedCount === 1) {
      const updatedJournal = await collection.findOne({
        _id: new ObjectId(journalId),
      });
      res.status(200).json({
        message: "Journal updated successfully",
        journal: updatedJournal,
        unchanged: result.modifiedCount === 0,
      });
    } else {
      res.status(404).json({ error: "Journal not found or not owned by user" });
    }
  } catch (error) {
    console.error("Full error details:", error);
    if (error.message.includes("ObjectId")) {
      return res.status(400).json({
        error: "Invalid journal ID format",
      });
    }
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Get top5 recent journals
router.get("/recents", async (req, res) => {
  try {
    const userId = req.query.userId;
    const collection = getJournalCollection();

    const recents = await collection
      .find({ userId, isHidden: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    const result = recents.map((journal) => ({
      _id: journal._id,
      title: journal.title,
      content: journal.content,
      createdAt: journal.createdAt,
      status: journal.status,
      isFavourite: journal.isFavourite,
    }));

    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json("Invalid userId");
  }
});

//Soft Delete /delete/:id
router.patch("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const journalId = req.params.id;
    const userId = req.user.id; // From authMiddleware
    const collection = getJournalCollection();

    // Convert string to ObjectId
    const objectId = new ObjectId(journalId);

    // Find and update the journal, ensuring it belongs to the authenticated user
    const result = await collection.updateOne(
      {
        _id: objectId,
        userId: userId, // Ensure the journal belongs to the current user
      },
      {
        $set: {
          isHidden: true,
          deletedAt: new Date(),
        },
      }
    );

    // Check if the journal was actually updated
    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Journal not found or you do not have permission to delete",
      });
    }

    // Fetch the updated journal to return
    const updatedJournal = await collection.findOne({
      _id: objectId,
    });

    res.status(200).json({
      message: "Journal deleted successfully",
      journal: updatedJournal,
    });
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(400).json({
        error: "Invalid journal ID format",
      });
    }
    console.error("Error soft deleting journal:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//edit Journal
router.patch("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, isFavourite, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const collection = getJournalCollection();

    // Create update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isFavourite !== undefined) updateData.isFavourite = isFavourite;
    if (status !== undefined) updateData.status = status;

    // Add last edited date
    const updatedAt = new Date();
    updateData.updatedAt = updatedAt;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Journal not found" });
    }

    // Get the updated journal to return to the client
    const updatedJournal = await collection.findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//get journal by id
router.get("/journal/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const collection = getJournalCollection();

    const journal = await collection.findOne({
      _id: new ObjectId(id),
      isHidden: false,
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.status(200).json({
      _id: journal._id,
      title: journal.title,
      content: journal.content,
      createdAt: journal.createdAt,
      status: journal.status,
      isFavourite: journal.isFavourite,
    });
  } catch (error) {
    console.error("Error fetching journal:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get current streak
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const usersCollection = getUserCollection();
    const userId = req.user.id; // userId is a string

    const objectId = new ObjectId(userId); // Convert to ObjectId

    const user = await usersCollection.findOne({ _id: objectId }); // Query with ObjectId

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ streak: user.streak?.count || 0 });
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ error: "Failed to fetch streak" });
  }
});

//get user personal information
router.get("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const usersCollection = getUserCollection();
    const userId = req.params.id;

    const objectId = new ObjectId(userId);

    const user = await usersCollection.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      _Id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("fail to fetch user", error);
    return res.status(500).json({ error: "Server error" });
  }
});

//update profile details
router.patch("/update-profile", authMiddleware, async (req, res) => {
  try {
    const usersCollection = getUserCollection();
    const userId = req.user.id;
    const { username, email } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    const result = usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the updated data to return to the client
    const updatedDetails = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    res.status(200).json(updatedDetails);
  } catch (error) {
    console.error("failed to update details", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

router.patch("/change-password", authMiddleware, async (req, res) => {
  try {
    const usersCollection = getUserCollection();
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    const objectId = new ObjectId(userId)
    const user = await usersCollection.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usersCollection.updateOne(
      { _id: objectId },
      { $set: { password: hashedPassword } }
    );
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;