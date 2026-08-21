import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 15000,
});

try {
  await client.connect();

  const result = await client
    .db("admin")
    .command({ ping: 1 });

  console.log(result);
} finally {
  await client.close();
}