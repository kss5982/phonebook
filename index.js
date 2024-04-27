import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import Person from "./models/person.js";
import configuration from "./utils/config.js";
import logger from "./utils/logger.js";

const app = express();
app.use(express.json());
app.use(express.static("dist"));

app.use(cors());
app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>Bruh</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  Person.find({}).then((people) => {
    response.send(
      `Phonebook has info for ${people.length} people<br/>${new Date()}`
    );
  });
});

app.post("/api/persons", (request, response, next) => {
  const { body } = request;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

app.listen(configuration.PORT, () => {
  logger.info(`Server running on port ${configuration.PORT}`);
});
