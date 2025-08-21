import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

declare global {
  // avoid re-creating client in dev hot-reload
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) global._mongoClientPromise = client.connect();
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
