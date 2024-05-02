import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { log } from "node:console";
import Person from "../models/person.js";
import helper from "./test_helper.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

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
