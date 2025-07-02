const { model, Schema } = require("mongoose");

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});

const Lesson = model("Lesson", lessonSchema);

module.exports = Lesson;
