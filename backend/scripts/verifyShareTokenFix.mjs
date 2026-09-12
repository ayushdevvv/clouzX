/**
 * Verification harness for the shareToken E11000 fix.
 *
 * This sandbox has no reachable MongoDB server (outbound network is
 * restricted to package registries only), so this script can't open a
 * real connection. Instead it does two things that together cover the
 * bug end to end:
 *
 *   A) Loads the ACTUAL File model and checks what Mongoose really
 *      produces for a normal upload - this is real schema behavior,
 *      not a guess.
 *   B) Replays that output through a small simulator of MongoDB's
 *      sparse unique index rules (a doc is only skipped by a sparse
 *      index when the field is entirely ABSENT - an explicit `null`
 *      still gets indexed). This is the exact rule that caused the
 *      original E11000 error, so passing here means the same
 *      operations will not collide against a real MongoDB deployment.
 *
 * Run: node scripts/verifyShareTokenFix.mjs
 *
 * This does not replace running scripts/fixShareTokenIndex.js against
 * your real database, or the manual test steps in the PR/notes.
 */

import crypto from "crypto";
import File from "../models/File.js";

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log("  PASS - " + label);
  } else {
    console.log("  FAIL - " + label);
    failures++;
  }
}

// --- Simulated MongoDB sparse+unique index -------------------------------
// Mirrors real Mongo semantics: only docs where the field is present
// (even if the value is null) participate in the uniqueness check.
function makeSparseUniqueIndex() {
  const seen = new Map();
  return {
    insert(doc) {
      const hasField = Object.prototype.hasOwnProperty.call(doc, "shareToken");
      if (!hasField) return { ok: true }; // sparse: skipped entirely
      const value = doc.shareToken;
      if (seen.has(value)) {
        return { ok: false, error: "E11000 duplicate key error ... shareToken: " + JSON.stringify(value) };
      }
      seen.set(value, doc._id);
      return { ok: true };
    },
    remove(doc) {
      if (Object.prototype.hasOwnProperty.call(doc, "shareToken")) {
        seen.delete(doc.shareToken);
      }
    },
  };
}

console.log("\n1) Multiple uploads without sharing (this used to throw E11000)");
const index = makeSparseUniqueIndex();
const uploadedDocs = [];

for (let i = 1; i <= 5; i++) {
  // Exactly what uploadFile() passes to File.create() - no shareToken key.
  const doc = new File({
    owner: new (await import("mongoose")).default.Types.ObjectId(),
    name: "file" + i + ".txt",
    originalName: "file" + i + ".txt",
    fileType: "text/plain",
    size: 100,
    url: "https://example.com/" + i,
    cloudinaryId: "id" + i,
  });
  const obj = doc.toObject();
  check(
    "upload #" + i + ": shareToken key is absent (no stray default)",
    !Object.prototype.hasOwnProperty.call(obj, "shareToken")
  );
  const result = index.insert(obj);
  check("upload #" + i + ": inserts cleanly against sparse unique index", result.ok);
  uploadedDocs.push(obj);
}

console.log("\n2) Old buggy behavior, for contrast (explicit null on every doc)");
const buggyIndex = makeSparseUniqueIndex();
const buggyDoc1 = { _id: 1, shareToken: null };
const buggyDoc2 = { _id: 2, shareToken: null };
check("buggy doc #1 inserts", buggyIndex.insert(buggyDoc1).ok);
const buggyResult2 = buggyIndex.insert(buggyDoc2);
check("buggy doc #2 correctly reproduces the reported E11000", buggyResult2.ok === false);

console.log("\n3) Generate, open, and revoke a share link");
const target = uploadedDocs[0];
target.shareToken = crypto.randomBytes(16).toString("hex");
target.shareEnabled = true;
let result = index.insert(target);
check("createShare: token inserts into the unique index without collision", result.ok);

const found = uploadedDocs.find(function (d) { return d.shareToken === target.shareToken; });
check("openShare: file is findable by its shareToken", found === target);

// Simulate the $unset revoke performs.
index.remove(target);
delete target.shareToken;
target.shareEnabled = false;
check("revokeShare: shareToken key fully removed (unset, not null)", !Object.prototype.hasOwnProperty.call(target, "shareToken"));

// A 6th unshared upload after a revoke must still not collide.
const sixth = new File({
  owner: new (await import("mongoose")).default.Types.ObjectId(),
  name: "file6.txt",
  originalName: "file6.txt",
  fileType: "text/plain",
  size: 100,
  url: "https://example.com/6",
  cloudinaryId: "id6",
}).toObject();
result = index.insert(sixth);
check("upload #6 (after a revoke elsewhere): still inserts cleanly", result.ok);

console.log("\n4) Schema/index declaration sanity check");
const shareTokenIndex = File.schema
  .indexes()
  .find(function (entry) { return Object.prototype.hasOwnProperty.call(entry[0], "shareToken"); });
check("shareToken index exists on the schema", !!shareTokenIndex);
check("schema index is declared unique", !!(shareTokenIndex && shareTokenIndex[1].unique));
check("schema index is declared sparse", !!(shareTokenIndex && shareTokenIndex[1].sparse));
check(
  "schema path has no default value for shareToken",
  File.schema.path("shareToken").defaultValue === undefined
);

console.log("\n" + (failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"));
process.exit(failures === 0 ? 0 : 1);
