const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./client");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
      },
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/lessons", async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: true,
      },
    });
    res.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
