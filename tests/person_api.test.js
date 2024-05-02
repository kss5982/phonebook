import { test, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { log } from "node:console";
import Person from "../models/person.js";
import helper from "./test_helper.js";

const api = supertest(app);
beforeEach(async () => {
  await Person.deleteMany({});
  console.log("cleared");

  for (let person of helper.initialPersons) {
    let personObject = new Person(person);
    await personObject.save();
  }
  console.log("done");
});

test("notes are returned as json", async () => {
  await api
    .get("/api/persons")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there is at least 1 person in the database", async () => {
  const response = await api.get("/api/persons");
  assert.strictEqual(response.body.length > 0, true);
});

test("the first person has the name 'karan'", async () => {
  const response = await api.get("/api/persons");
  const contents = response.body[0].name;
  assert.strictEqual(contents, "Karan Sandhu");
});

test("a valid person can be added", async () => {
  const newPerson = {
    name: "Test Person",
    number: "00-0000000",
  };

  await api
    .post("/api/persons")
    .send(newPerson)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const personsAtEnd = await helper.personsInDb();
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1);
  const contents = personsAtEnd.map((r) => r.name);

  assert(contents.includes("Test Person"));
});

test("person without content is not added", async () => {
  const newPerson = {
    number: "00-0000000",
  };

  await api.post("/api/persons").send(newPerson).expect(400);

  const personsAtEnd = await helper.personsInDb();

  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length);
});

after(async () => {
  await mongoose.connection.close();
});
