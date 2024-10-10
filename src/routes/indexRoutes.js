import { Router } from "express";
import authRoutes from "./authRoutes.js";
import quizRoutes from "./quizRoutes.js";

import { authenticate } from "../middleware/authenticate.js";
const routes = Router();

// user routes
routes.use("/auth", authRoutes);

// quiz routes
routes.use("/quiz", authenticate, quizRoutes);

export default routes;
