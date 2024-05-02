import configuration from "./utils/config.js";
import express from "express";
import cors from "cors";
import personRouter from "./controllers/persons.js";
import usersRouter from "./controllers/users.js";
import middleware from "./utils/middleware.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import mongoose from "mongoose";

const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(configuration.MONGODB_URI)
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/persons", personRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
