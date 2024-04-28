import express from "express";
import Person from "../models/person.js";

const personRouter = express.Router();

personRouter.get("/", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

personRouter.get("/:id", (request, response, next) => {
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

personRouter.get("/info", (request, response) => {
  Person.find({}).then((people) => {
    response.send(
      `Phonebook has info for ${people.length} people<br/>${new Date()}`
    );
  });
});

personRouter.post("/", (request, response, next) => {
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

personRouter.put("/:id", (request, response, next) => {
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

personRouter.delete("/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

export default personRouter;
