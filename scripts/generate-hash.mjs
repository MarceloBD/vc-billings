import { hash } from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-hash.mjs YOUR_PASSWORD");
  process.exit(1);
}

const hashed = await hash(password, 10);
const base64Hash = Buffer.from(hashed).toString("base64");

console.log("\nCopy this line into your .env file:");
console.log(`AUTH_PASSWORD_HASH=${base64Hash}`);
