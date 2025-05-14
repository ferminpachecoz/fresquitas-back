// db/mongo.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://ferminpz:pacheco2002@cluster0.q9s2nsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("fresquitas_db");
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
}


function getDB() {
  return db;
}

module.exports = { connectToMongo, getDB };
