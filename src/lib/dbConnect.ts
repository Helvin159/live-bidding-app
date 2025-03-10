import { MongoClient } from 'mongodb';

const uri: string | undefined = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('No URI String available for mongo db');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri ?? '', options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoCLientPromise;
} else {
  client = new MongoClient(uri ?? '', options);
  clientPromise = client.connect();
}

export default clientPromise;
