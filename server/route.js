const express = require("express");

const router = express.Router();

// GET /journal
router.get("/journals", (req, res) => {
  res.status(200).json({ mssg: "GET requres to /api/journals " });
});

//POST /journal
router.post("/journals", (req, res) => {
    res.status(200).json({ mssg: "POST request to /api/journals"})
})

//DELETE /journal/:id
router.delete("/journals/:id", (req, res) => {
    res.status(200).json({ mssg: "DELETE request to /api/journals:id" })
})


//PUT /journal/:id
router.put("/journals/:id", (req, res) => {
    res.status(200).json({ mssg: "PUT request to /api/journals:id" })
})

module.exports = router;