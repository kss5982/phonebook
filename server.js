import express, { request } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: 1 },
  { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  { name: "Mary Poopcock", number: "39-23-6423122", id: 4 },
];

app.get("/", (request, response) => {
  response.send("<h1>Bruh</h1>");
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(400).json({
      error: `Person with id ${id} does not exist!`,
    });
  }
  response.send(person);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><br/>${new Date()}`
  );
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.find((original) => original.name == person.name)) {
    return response.status(400).json({
      error: "That person already exists!",
    });
  } else if (persons.find((original) => original.number == person.number)) {
    return response.status(400).json({
      error: "A person with that number already exists!",
    });
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = import.meta.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
