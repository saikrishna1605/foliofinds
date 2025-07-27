import { MongoClient } from 'mongodb';

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URIS?.split(',')[0] || '';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Function to get a database connection directly
export async function getDirectDb() {
  try {
    console.log("Attempting direct MongoDB connection...");
    const client = await MongoClient.connect(MONGODB_URI);
    console.log("Direct MongoDB connection successful!");
    return client.db("Folio");
  } catch (error) {
    console.error("Error connecting directly to MongoDB:", error);
    throw error;
  }
}

// Function to get a specific collection
export async function getCollection(collectionName: string) {
  const db = await getDirectDb();
  return db.collection(collectionName);
}
