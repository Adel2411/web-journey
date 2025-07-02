const express = require("express");
const Lesson = require("../models/Lesson");

const router = express.Router();

// Create a new lesson
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newLesson = new Lesson({ title, content });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating lesson", error: error.message });
  }
});

// Get all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lessons", error: error.message });
  }
});

// Get a lesson by ID
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lesson", error: error.message });
  }
});

// Update a lesson by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(updatedLesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating lesson", error: error.message });
  }
});

// Delete a lesson by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lesson", error: error.message });
  }
});

module.exports = router;
