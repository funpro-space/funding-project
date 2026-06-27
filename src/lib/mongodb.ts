import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "production") {
    if (!MONGODB_URI || MONGODB_URI.toLowerCase().includes("placeholder") || MONGODB_URI === "undefined") {
      console.error("\n==================================================================");
      console.error("❌ CRITICAL ERROR: MONGODB_URI IS MISSING OR INVALID IN PRODUCTION!");
      console.error("The application cannot function without a valid database connection.");
      console.error("Please ensure MONGODB_URI is correctly configured in your deployment env.");
      console.error("==================================================================\n");
      throw new Error("MONGODB_URI is missing or invalid in production environment.");
    }
  } else if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined in environment variables. Falling back to default local MongoDB connection.");
  }

  const connectionString = MONGODB_URI || "mongodb://127.0.0.1:27017/funpro";

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    if (cached && cached.promise) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    throw e;
  }

  return cached ? cached.conn : null;
}

export default dbConnect;
