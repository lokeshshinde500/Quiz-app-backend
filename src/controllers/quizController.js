import quizModel from "../models/quizModel.js";
import userResponseModel from "../models/userResponseModel.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Validate input
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "Title is required and must be a non-empty string." });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          message: "Description is required and must be a non-empty string.",
        });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({
          message: "Questions are required and should be a non-empty array.",
        });
    }

    // Validate each question
    for (const question of questions) {
      if (
        !question.question ||
        typeof question.question !== "string" ||
        question.question.trim() === ""
      ) {
        return res
          .status(400)
          .json({ message: "Each question must have a valid question text." });
      }

      if (!question.options || typeof question.options !== "object") {
        return res
          .status(400)
          .json({
            message: "Options must be an object containing A, B, C, and D.",
          });
      }

      const optionKeys = ["A", "B", "C", "D"];
      for (const key of optionKeys) {
        if (
          !question.options[key] ||
          typeof question.options[key] !== "string" ||
          question.options[key].trim() === ""
        ) {
          return res
            .status(400)
            .json({
              message: `Option ${key} is required and must be a non-empty string.`,
            });
        }
      }

      if (!question.correctAns || !optionKeys.includes(question.correctAns)) {
        return res
          .status(400)
          .json({ message: "Correct answer must be one of A, B, C, or D." });
      }
    }

    // Create new quiz document
    const newQuiz = new quizModel({
      title,
      description,
      questions,
    });

    // Save the quiz to the database
    const createQuiz = await newQuiz.save();

    // Send success response
    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: createQuiz,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};

// get all quizzes
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModel.find({});

    // no quizzes found
    if (!quizzes.length) {
      return res.status(400).json({
        message: "Quizzes are not founds",
      });
    }

    if (!quizzes) {
      return res.status(400).json({
        message: "Quizzes are not founds",
      });
    }

    // Send success response
    return res.status(200).json({
      quizzes: quizzes,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};

// get single quiz by quizId
export const getQuiz = async (req, res) => {
  try {
    const quiz = await quizModel.findById(req.params.quizId);

    if (!quiz) {
      return res.status(400).json({
        message: "Quiz not founds",
      });
    }

    // Send success response
    return res.status(200).json({
      quiz: quiz,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};

// delete quiz by quizId
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await quizModel.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
      return res.status(400).json({
        message: "Quiz not founds",
      });
    }

    // Send success response
    return res.status(200).json({
      quiz: "Quiz deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};

// submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const isAlreadyattended = await userResponseModel.findOne({
      quizId: quizId,
      userId: req.user.id,
    });

    if (isAlreadyattended) {
      return res.status(400).json({
        message: "Quiz already attended!",
        success: false,
      });
    }

    // Validate input
    if (!quizId || !answers) {
      return res.status(400).json({
        message: "Quiz or responses are required!",
        success: false,
      });
    }

    // Validate quizId exists in the database
    const quiz = await quizModel.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found.", success: false });
    }

    let score = 0;

    if (!answers || answers.length > quiz.questions.length) {
      return res.status(400).json({
        message: "Invalid answers provided!",
        success: false,
      });
    }

    quiz.questions.forEach((question, i) => {
      if (answers[i].toLowerCase() === question.correctAns.toLowerCase()) {
        score += 1;
      }
    });

    const result = {
      quizId,
      userId: req.user.id,
      score: parseInt(score),
    };

    await userResponseModel.create(result);

    // Send success response
    return res.status(201).json({
      message: "quiz submitted successfully.",
      score: score,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};

// view score
export const viewScore = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    // Validate quizId exists in the database
    const quiz = await quizModel.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found.", success: false });
    }

    const result = await userResponseModel.findOne({
      quizId: quizId,
      userId: userId,
    });

    if (!result) {
      return res
        .status(400)
        .json({ message: "You are not attended this quiz!", success: false });
    }

    // Send success response
    return res.status(201).json({
      result: result,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", error: error.message });
  }
};
