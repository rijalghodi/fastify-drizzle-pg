import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "@/config/env";
import * as schema from "@/infra/db/schema/index";

const pool = new pg.Pool({ connectionString: env.databaseUrl });
export const db = drizzle({ client: pool, schema });

export type Db = typeof db;

export async function closeDb(): Promise<void> {
  await pool.end();
}
