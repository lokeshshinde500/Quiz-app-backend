import mongoose from "mongoose";

const userResponseSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const userResponseModel = mongoose.model("UserResponse", userResponseSchema);
export default userResponseModel;
