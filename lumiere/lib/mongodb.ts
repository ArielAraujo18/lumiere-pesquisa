import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI não foi definida em .env.local");
}

const options = {
  family: 4,

  tls: true,

  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  serverSelectionTimeoutMS: 15000,
};

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global.mongoClientPromise = client.connect();
  }

  clientPromise = global.mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;