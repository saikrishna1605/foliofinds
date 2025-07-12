import { MongoClient } from 'mongodb';

// Hardcoded connection string as a last resort
const MONGODB_URI = "mongodb://yvdidejd:ORLTMqdzTC9HtAoI@cluster0.3t2bci6.mongodb.net:27017/Folio?retryWrites=true&w=majority";

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
