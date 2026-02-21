import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

const isLocalDatabase = process.env.DATABASE_URL?.includes("localhost");

function createDatabase() {
  if (isLocalDatabase) {
    const client = postgres(process.env.DATABASE_URL!);
    return drizzlePostgres(client, { schema });
  }

  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

type DatabaseType = ReturnType<typeof createDatabase>;

let cachedDatabase: DatabaseType | null = null;

export function getDatabase(): DatabaseType {
  if (!cachedDatabase) {
    cachedDatabase = createDatabase();
  }
  return cachedDatabase as DatabaseType;
}
