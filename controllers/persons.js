import express from "express";
import Person from "../models/person.js";
import "express-async-errors";
import User from "../models/user.js";

const personRouter = express.Router();

personRouter.get("/", async (request, response) => {
  const persons = await Person.find({}).catch((error) => next(error));
  response.json(persons);
});

personRouter.get("/:id", async (request, response, next) => {
  const { id } = request.params;

  const person = await Person.findById(id).catch((error) => next(error));
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

personRouter.post("/", async (request, response, next) => {
  const { body } = request;

  const user = await User.findById(body.userId);
  const person = new Person({
    name: body.name,
    number: body.number,
    user: user.id,
  });

  const savedPerson = await person.save().catch((error) => next(error));
  user.contact = user.contact.concat(savedPerson._id);
  await user.save();
  response.status(201).json(savedPerson);
});

personRouter.put("/:id", async (request, response, next) => {
  const { name, number } = request.body;

  const updatedPerson = await Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  ).catch((error) => next(error));
  response.json(updatedPerson);
});

personRouter.delete("/:id", async (request, response, next) => {
  const { id } = request.params;
  await Person.findByIdAndDelete(id).catch((error) => next(error));
  response.status(204).end();
});

export default personRouter;
