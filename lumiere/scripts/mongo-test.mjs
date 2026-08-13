import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {
  family: 4,
  tls: true,
  serverSelectionTimeoutMS: 15000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

const client = new MongoClient(uri, options);

try {
  await client.connect();
  console.log(await client.db("lumi").command({ ping: 1 }));
  console.log(
    await client.db("lumi").collection("noticias").find({}).limit(1).toArray()
  );
} finally {
  await client.close();
}
EOF