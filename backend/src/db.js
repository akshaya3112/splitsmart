// Lightweight JSON-file backed data store.
// Swap this file for a DynamoDB-backed implementation later without touching
// any route code — every function here returns plain JS objects/arrays.
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "db.json");

const DEFAULT_DATA = { groups: {}, members: {}, expenses: {} };

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

// Simple mutex so concurrent requests don't clobber the JSON file.
let queue = Promise.resolve();
function withLock(fn) {
  const result = queue.then(() => fn());
  queue = result.catch(() => {});
  return result;
}

export const db = {
  async getAll(collection) {
    const data = await readData();
    return Object.values(data[collection] || {});
  },
  async get(collection, id) {
    const data = await readData();
    return data[collection]?.[id] ?? null;
  },
  async put(collection, id, value) {
    return withLock(async () => {
      const data = await readData();
      if (!data[collection]) data[collection] = {};
      data[collection][id] = value;
      await writeData(data);
      return value;
    });
  },
  async remove(collection, id) {
    return withLock(async () => {
      const data = await readData();
      delete data[collection]?.[id];
      await writeData(data);
    });
  },
  async filter(collection, predicate) {
    const data = await readData();
    return Object.values(data[collection] || {}).filter(predicate);
  },
};
