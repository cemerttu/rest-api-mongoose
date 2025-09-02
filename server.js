// server.js
require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const mongoose = require("mongoose");
const Person = require("./models/person"); // Assuming a Person model exists

const app = express();
const port = 3000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// -------- Create and Save a Record --------
const createAndSavePerson = async () => {
  try {
    const person = new Person({
      name: "John Doe",
      age: 30,
      favoriteFoods: ["pizza", "pasta"],
    });

    const savedPerson = await person.save();
    console.log("✅ Saved person:", savedPerson);
  } catch (err) {
    console.error("❌ Error saving person:", err);
  }
};

// -------- Create Many People --------
const arrayOfPeople = [
  { name: "Mary", age: 25, favoriteFoods: ["salad", "tofu"] },
  { name: "Steve", age: 40, favoriteFoods: ["steak", "burritos"] },
  { name: "Mary", age: 22, favoriteFoods: ["pizza", "burritos"] },
];

const createManyPeople = async (people) => {
  try {
    const created = await Person.create(people);
    console.log("✅ Created many people:", created);
  } catch (err) {
    console.error("❌ Error creating people:", err);
  }
};

// -------- Find People by Name --------
const findPeopleByName = async (personName) => {
  try {
    const people = await Person.find({ name: personName });
    console.log(`✅ People named "${personName}":`, people);
  } catch (err) {
    console.error("❌ Error finding people:", err);
  }
};

// -------- Find One by Favorite Food --------
const findOneByFood = async (food) => {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    console.log(`✅ Found one who likes "${food}":`, person);
  } catch (err) {
    console.error("❌ Error finding person by food:", err);
  }
};

// -------- Find by ID --------
const findPersonById = async (personId) => {
  try {
    const person = await Person.findById(personId);
    console.log("✅ Found person by ID:", person);
  } catch (err) {
    console.error("❌ Error finding by ID:", err);
  }
};

// -------- Classic Update: Find, Edit, Save --------
const findEditThenSave = async (personId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      console.log("❌ Person not found for update.");
      return;
    }
    person.favoriteFoods.push("hamburger");
    const updatedPerson = await person.save();
    console.log("✅ Added hamburger and saved:", updatedPerson);
  } catch (err) {
    console.error("❌ Error updating person:", err);
  }
};

// -------- Find and Update --------
const findAndUpdate = async (personName) => {
  try {
    const updated = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true } // Return the updated document
    );
    console.log("✅ Updated age to 20:", updated);
  } catch (err) {
    console.error("❌ Error updating age:", err);
  }
};

// -------- Delete by ID --------
const removeById = async (personId) => {
  try {
    const removed = await Person.findByIdAndRemove(personId);
    console.log("✅ Removed person by ID:", removed);
  } catch (err) {
    console.error("❌ Error removing person:", err);
  }
};

// -------- Delete Many --------
const removeManyPeople = async () => {
  try {
    const result = await Person.deleteMany({ name: "Mary" });
    console.log('✅ Deleted all "Mary" entries:', result);
  } catch (err) {
    console.error("❌ Error deleting Marys:", err);
  }
};

// -------- Chain Query Helpers --------
const queryChain = async () => {
  try {
    const result = await Person.find({ favoriteFoods: "burritos" })
      .sort("name")
      .limit(2)
      .select("-age")
      .exec();

    console.log("✅ Query chain result:", result);
  } catch (err) {
    console.error("❌ Error with query chain:", err);
  }
};

// Run all operations in sequence
const runAll = async () => {
  await connectDB();

  await createAndSavePerson();
  await createManyPeople(arrayOfPeople);

  await findPeopleByName("Mary");
  await findOneByFood("burritos");

  // Get a person for ID-based tests
  const person = await Person.findOne();
  if (person) {
    await findPersonById(person._id);
    await findEditThenSave(person._id);
    await removeById(person._id);
  }

  await findAndUpdate("Steve");
  await removeManyPeople();
  await queryChain();

  mongoose.disconnect();
};

runAll();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

console.log("MongoDB URI:", process.env.MONGODB_URI);
