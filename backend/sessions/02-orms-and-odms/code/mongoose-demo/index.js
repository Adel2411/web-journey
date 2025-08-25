const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const LessonRoutes = require("./routes/lesson.route");
const CourseRoutes = require("./routes/course.route");

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

connectDB();

app.use("/api/courses", CourseRoutes);
app.use("/api/lessons", LessonRoutes);
// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
