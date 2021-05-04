const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

const client = new MongoClient(uri, {useUnifiedTopology: true});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ping: 1});
    console.log("Connected to MongoDB server.");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
