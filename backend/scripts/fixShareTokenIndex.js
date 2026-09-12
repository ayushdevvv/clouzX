/**
 * One-off migration: fixes the E11000 duplicate key error on
 * `files` collection's shareToken_1 index.
 *
 * Root cause: the shareToken_1 index in the live database was built as
 * a plain unique index (no `sparse`) before the schema declared it
 * sparse. A plain unique index treats every document as having
 * shareToken: null (the old schema default), so the moment a second
 * unshared file was inserted, Mongo rejected it as a duplicate key.
 *
 * This script is idempotent and safe to re-run:
 *   1. Clears any lingering `shareToken: null` values on existing
 *      documents (unsets the field instead of leaving it null - a
 *      sparse index still indexes explicit nulls, so this step is
 *      required, not optional).
 *   2. Drops the existing shareToken_1 index only if it isn't already
 *      the correct { unique: true, sparse: true } index.
 *   3. Recreates shareToken_1 as unique + sparse.
 *   4. Leaves everything alone if the index is already correct, so
 *      running it twice never errors or creates a duplicate index.
 *
 * Usage:
 *   node scripts/fixShareTokenIndex.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const INDEX_NAME = "shareToken_1";

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to your .env before running this script.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;
  const collection = db.collection("files");

  // Step 1: strip explicit nulls left over from the old schema default.
  // These would otherwise still collide once the index is sparse+unique,
  // since sparse only skips documents missing the field entirely.
  const nullCleanup = await collection.updateMany(
    { shareToken: null },
    { $unset: { shareToken: "" } }
  );
  console.log(
    "Removed explicit shareToken: null from " + nullCleanup.modifiedCount + " document(s)."
  );

  // Step 2: guard against real duplicate (non-null) tokens before we try
  // to enforce uniqueness - report them instead of failing blindly.
  const duplicates = await collection
    .aggregate([
      { $match: { shareToken: { $exists: true, $ne: null } } },
      { $group: { _id: "$shareToken", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  if (duplicates.length > 0) {
    console.error(
      "Found " + duplicates.length + " duplicate shareToken value(s) - resolve these manually before the unique index can be created:"
    );
    console.error(JSON.stringify(duplicates, null, 2));
    await mongoose.disconnect();
    process.exit(1);
  }

  // Step 3: inspect the existing index and only touch it if needed.
  const existingIndexes = await collection.indexes();
  const existing = existingIndexes.find((idx) => idx.name === INDEX_NAME);

  if (existing && existing.unique && existing.sparse) {
    console.log("shareToken_1 is already unique + sparse. Nothing to do.");
  } else {
    if (existing) {
      console.log("Dropping existing non-sparse shareToken_1 index...");
      await collection.dropIndex(INDEX_NAME);
    }

    console.log("Creating shareToken_1 as unique + sparse...");
    await collection.createIndex(
      { shareToken: 1 },
      { unique: true, sparse: true, name: INDEX_NAME }
    );
    console.log("Done.");
  }

  await mongoose.disconnect();
  console.log("Migration complete.");
}

run().catch(function (error) {
  console.error("Migration failed:", error);
  process.exit(1);
});
