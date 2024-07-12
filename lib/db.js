const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://cevriyeceven:j0kC9Kmmp39QoUKV@cluster0.p3dx38t.mongodb.net/';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!client.isConnected()) {
    await client.connect();
  }

  cachedClient = client;
  return client;
}

export default connectToDatabase;

