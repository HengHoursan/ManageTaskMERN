const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = process.env.MONGO_URI;
db.user = require("./user.model.js");
db.task = require("./task.model.js");

module.exports = db;
