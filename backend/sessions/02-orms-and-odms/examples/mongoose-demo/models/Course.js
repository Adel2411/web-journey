const { model, Schema } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const Course = model("Course", courseSchema);

module.exports = Course;
