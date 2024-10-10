import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    A: {
      type: String,
      required: true,
    },
    B: {
      type: String,
      required: true,
    },
    C: {
      type: String,
      required: true,
    },
    D: {
      type: String,
      required: true, 
    },
  },
  correctAns: {
    type: String,
    required: true,
    enum: ["A", "B", "C", "D"],
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const quizModel = mongoose.model("Quiz", quizSchema);
export default quizModel;
