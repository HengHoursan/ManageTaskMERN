const mongooes = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MongoConnection = async () => {
  try {
    await mongooes.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

module.exports = MongoConnection;