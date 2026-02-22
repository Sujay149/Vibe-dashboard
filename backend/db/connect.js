const mongoose = require('mongoose');

const connectDB = async () => {
  const RETRY_DELAY = 5000;

  const attempt = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.error(`[MongoDB] Connection failed: ${error.message}`);
      console.log(`[MongoDB] Retrying in ${RETRY_DELAY / 1000}s...`);
      setTimeout(attempt, RETRY_DELAY);
    }
  };

  attempt();
};

module.exports = connectDB;
