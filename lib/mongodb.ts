import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Cached connection state.
 * `conn` holds the active Mongoose instance once connected.
 * `promise` holds the in-flight connection promise to avoid creating
 * duplicate connections when multiple calls arrive before the first resolves.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global object so the cache survives hot-reloads in
 * Next.js development mode. Without this, every file change would open a
 * new connection because module-level variables are re-initialised on each
 * reload, but `global` persists for the lifetime of the Node process.
 */
declare global {

  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = (global._mongooseCache ??= {
  conn: null,
  promise: null,
});

/**
 * Returns a cached Mongoose connection, creating one on the first call.
 * Safe to call in any Server Component, Route Handler, or Server Action —
 * concurrent calls share the same promise and resolve to the same instance.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Re-use an existing open connection.
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection only if one isn't already in progress.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Disable Mongoose's internal buffering so operations fail fast when
      // the DB is unreachable rather than queuing indefinitely.
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
