const { connectToDatabase } = require('../lib/db');

async function getUserByEmail(email) {
  const db = await connectToDatabase(process.env.MONGODB_URI);
  const users = db.collection('users');
  const user = await users.findOne({ email });
  return user;
}

module.exports = { getUserByEmail };
