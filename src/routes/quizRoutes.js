import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzes,
  submitQuiz,
  viewScore,
} from "../controllers/quizController.js";
const routes = Router();

// routes

// create quiz
routes.post("/", createQuiz);

// get all quizzes
routes.get("/", getQuizzes);

// get single quiz by id
routes.get("/:quizId", getQuiz);

// get single quiz by id
routes.delete("/:quizId", deleteQuiz);

// submit quiz
routes.post("/:quizId/submit", submitQuiz);

// get result
routes.get("/:quizId/score", viewScore);

export default routes;
