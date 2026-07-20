// Hybrid Data Store: local JSON-file fallback or MongoDB Atlas
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "db.json");

const DEFAULT_DATA = { groups: {}, members: {}, expenses: {}, users: {} };

const mongoUri = process.env.DATABASE_URI;
let client = null;
let mongoDb = null;

if (mongoUri) {
  client = new MongoClient(mongoUri);
  client
    .connect()
    .then(() => {
      mongoDb = client.db("splitsmart");
      console.log("Connected successfully to MongoDB Atlas database: splitsmart");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB Atlas:", err);
    });
} else {
  console.log("No DATABASE_URI env variable set. Running in local db.json fallback mode.");
}

// Local db.json helpers
async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

async function readData() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

let queue = Promise.resolve();
function withLock(fn) {
  const result = queue.then(() => fn());
  queue = result.catch(() => {});
  return result;
}

export const db = {
  async getAll(collection) {
    if (mongoDb) {
      const items = await mongoDb.collection(collection).find({}).toArray();
      // Map _id to string/exclude it to match our JSON database payload exactly
      return items.map(({ _id, ...rest }) => rest);
    }
    const data = await readData();
    return Object.values(data[collection] || {});
  },

  async get(collection, id) {
    if (mongoDb) {
      const item = await mongoDb.collection(collection).findOne({ id });
      if (!item) return null;
      const { _id, ...rest } = item;
      return rest;
    }
    const data = await readData();
    return data[collection]?.[id] ?? null;
  },

  async put(collection, id, value) {
    if (mongoDb) {
      const { _id, ...rest } = value;
      await mongoDb.collection(collection).replaceOne({ id }, rest, { upsert: true });
      return value;
    }
    return withLock(async () => {
      const data = await readData();
      if (!data[collection]) data[collection] = {};
      data[collection][id] = value;
      await writeData(data);
      return value;
    });
  },

  async remove(collection, id) {
    if (mongoDb) {
      await mongoDb.collection(collection).deleteOne({ id });
      return;
    }
    return withLock(async () => {
      const data = await readData();
      delete data[collection]?.[id];
      await writeData(data);
    });
  },

  async filter(collection, predicate) {
    if (mongoDb) {
      const items = await mongoDb.collection(collection).find({}).toArray();
      const mapped = items.map(({ _id, ...rest }) => rest);
      return mapped.filter(predicate);
    }
    const data = await readData();
    return Object.values(data[collection] || {}).filter(predicate);
  },
};
