import { getDb } from "./database.js";
import { ObjectId } from "mongodb";

async function updateStreak(userId, testDate = null) {
    const db = getDb();
    let userObjectId;
  
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      console.error("Invalid userId format:", userId);
      throw new Error("Invalid userId format");
    }
  
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ _id: userObjectId });
  
    if (!user) {
      console.error("User not found for ID:", userId);
      throw new Error("User not found");
    }
  
    console.log("Found user:", user);

    // Use the test date if provided, otherwise use the current date
    const now = testDate ? new Date(testDate) : new Date();
    const lastEntryDate = user.streak?.lastEntryDate ? new Date(user.streak.lastEntryDate) : null;
    let streakCount = user.streak?.count || 0;
  
    if (!lastEntryDate) {
      // First entry ever
      streakCount = 1;
    } else {
      // Check if the last entry was on a different day
      const lastEntryDay = new Date(lastEntryDate.getFullYear(), lastEntryDate.getMonth(), lastEntryDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Calculate the difference in days
      const daysDiff = Math.floor((today - lastEntryDay) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, don't increment streak
        // Just return the current streak count
      } else if (daysDiff === 1) {
        // Next consecutive day, increment streak
        streakCount += 1;
      } else {
        // More than one day has passed, reset streak
        streakCount = 1;
      }
    }
  
    // Update user document with UTC time
    await usersCollection.updateOne(
      { _id: userObjectId },
      {
        $set: {
          "streak.count": streakCount,
          "streak.lastEntryDate": now.toISOString(),
        },
      }
    );
  
    return streakCount;
}

export { updateStreak };