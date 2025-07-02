const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Create a new course
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = new Course({ title, description });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
});

// Add a lesson to a course
router.post("/:courseId/lessons/:lessonId", async (req, res) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.courseId,
    { $push: { lessons: req.params.lessonId } },
    { new: true }
  );
  res.json(updated);
});

// Get a course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lessons");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
});

module.exports = router;
