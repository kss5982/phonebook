import Person from "../models/person.js";

const initialPersons = [
  {
    name: "Karan Sandhu",
    number: "07-7429212",
  },
  {
    name: "Mohit Mehta",
    number: "12-1354542",
  },
];

const nonExistingId = async () => {
  const person = new Person({ name: "willremovethissoon" });
  await person.save();
  await person.deleteOne();

  return person._id.toString();
};

const personsInDb = async () => {
  const persons = await Person.find({});
  return persons.map((person) => person.toJSON());
};

const helper = { initialPersons, nonExistingId, personsInDb };
export default helper;
