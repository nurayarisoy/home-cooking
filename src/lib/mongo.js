import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "";
const MONGO_DB_NAME = process.env.MONGODB_DB || "home_cooking";

let clientPromise;
let initPromise;

export function isMongoConfigured() {
  return Boolean(MONGO_URI);
}

async function getClient() {
  if (!isMongoConfigured()) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!clientPromise) {
    const client = new MongoClient(MONGO_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
}

async function ensureIndexes(db) {
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ id: 1 }, { unique: true });
  await db.collection("recipes").createIndex({ id: 1 }, { unique: true });
  await db.collection("recipes").createIndex({ author_email: 1, published: 1 });
  await db.collection("counters").createIndex({ _id: 1 }, { unique: true });
}

export async function getMongoDb() {
  const client = await getClient();
  const db = client.db(MONGO_DB_NAME);

  if (!initPromise) {
    initPromise = ensureIndexes(db).catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
  return db;
}

export async function nextSequence(counterName) {
  const db = await getMongoDb();
  const result = await db.collection("counters").findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  const value = result?.value || result;
  return Number(value?.seq || 1);
}
