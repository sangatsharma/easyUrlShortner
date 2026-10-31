// One-off: replace the global unique index on originalUrl with a per-owner one,
// so different users (and anonymous visitors) can each shorten the same URL.
// Run from Backend/: node scripts/migrate-url-index.cjs
require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  const urls = mongoose.connection.db.collection("easyurls");

  // The new unique index fails if any owner already has the same URL twice
  const dups = await urls
    .aggregate([
      { $group: { _id: { url: "$originalUrl", owner: "$userId" }, n: { $sum: 1 } } },
      { $match: { n: { $gt: 1 } } },
    ])
    .toArray();
  if (dups.length) {
    console.log("Duplicate (url, owner) pairs, resolve these first:", dups);
    process.exit(1);
  }

  const names = (await urls.indexes()).map((i) => i.name);
  if (names.includes("originalUrl_1")) await urls.dropIndex("originalUrl_1");
  await urls.createIndex({ originalUrl: 1, userId: 1 }, { unique: true });
  await urls.createIndex({ originalUrl: 1 });

  console.log("Indexes now:", (await urls.indexes()).map((i) => i.name + (i.unique ? " (unique)" : "")).join(", "));
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
