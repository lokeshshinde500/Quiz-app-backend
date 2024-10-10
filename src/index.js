import express from "express";
import cors from "cors";
import constant from "./config/constant.js";
import indexRoutes from "./routes/indexRoutes.js";
import db from "./config/db.js";

const app = express();
const port = constant.PORT;

// Enable CORS
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create server
app.listen(port, (error) => {
  if (error) {
    console.error("Server not connected!", error);
    return;
  }
  console.log(`Server running on Port ${port}`);
  db();
});

// routing
app.use("/api", indexRoutes);
