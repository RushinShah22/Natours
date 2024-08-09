const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const mongoose = require('mongoose');
const tour = require('./../../Model/tourModel');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

async function connectDB() {
  await mongoose
    .connect(DB, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    })
    .then(() => {
      console.log('connection successful');
    });
}

const data = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

async function importData() {
  try {
    await connectDB();
    await tour.create(JSON.parse(data));
    console.log('Successfully loaded!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

async function deleteData() {
  try {
    await connectDB();
    await tour.deleteMany();
    console.log('Successfully deleted!!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
