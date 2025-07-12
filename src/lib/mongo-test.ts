// This is a test file to check the MongoDB connection directly
import { MongoClient } from 'mongodb';

// Try multiple connection strings from environment variable only
const connectionStrings = (process.env.MONGODB_URIS || "").split(",").filter(Boolean);

export async function testMongoConnection() {
  console.log("Testing MongoDB connections...");
  
  for (const uri of connectionStrings) {
    try {
      console.log(`Trying connection with: ${uri.substring(0, 20)}...`);
      const client = await MongoClient.connect(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      });
      
      console.log("CONNECTION SUCCESSFUL!");
      const db = client.db("Folio");
      const collections = await db.listCollections().toArray();
      console.log(`Available collections: ${collections.map(c => c.name).join(', ')}`);
      
      await client.close();
      console.log("Connection closed");
      return true;
    } catch (error) {
      console.error(`Connection failed for ${uri.substring(0, 20)}...`, error);
    }
  }
  
  console.log("All connection attempts failed");
  return false;
}

// Export a function that can be triggered from API routes
export async function runConnectionTest() {
  return testMongoConnection();
}
