import { eq } from "drizzle-orm";
import type { Db } from "../../infra/db/client.js";
import { type NewUser, type User, users } from "../../infra/db/schema/users.js";

export class UserRepository {
  private db: Db;

  constructor({ db }: { db: Db }) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return rows[0];
  }

  async findById(id: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return rows[0];
  }

  async create(input: NewUser): Promise<User> {
    const rows = await this.db.insert(users).values(input).returning();
    const row = rows[0];
    if (!row) throw new Error("Failed to create user");
    return row;
  }
}
