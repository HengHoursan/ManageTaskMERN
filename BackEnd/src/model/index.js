const mongooes = require('mongoose');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
dotenv.config();

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongooes;
db.url  = process.env.MONGO_URI;
db.user = require('./user.model.js')
db.task = require('./task.model.js');

module.exports = db;