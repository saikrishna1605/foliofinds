import { MongoClient } from 'mongodb'

// Use a simple, direct connection string - this should work with MongoDB Atlas
const MONGODB_URI = "mongodb+srv://yvdidejd:ORLTMqdzTC9HtAoI@cluster0.3t2bci6.mongodb.net/Folio?retryWrites=true&w=majority";
const uri = process.env.MONGODB_URI || MONGODB_URI;

if (!uri) {
  throw new Error('Invalid/Missing MongoDB connection string.')
}

// Simple options object with timeout settings
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
};

// MongoDB connection handling
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Create a cached connection
const getMongoClient = () => {
  try {
    const client = new MongoClient(uri, options);
    return client.connect();
  } catch (e) {
    console.error("MongoDB connection error:", e);
    throw e;
  }
};

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromiseV2?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromiseV2) {
    globalWithMongo._mongoClientPromiseV2 = getMongoClient();
  }
  clientPromise = globalWithMongo._mongoClientPromiseV2;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = getMongoClient();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
