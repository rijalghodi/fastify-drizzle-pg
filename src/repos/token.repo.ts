import { eq } from "drizzle-orm";
import type { Db } from "@/db/client";
import { type NewToken, tokens } from "@/db/models";

export class TokenRepo {
  constructor(private readonly db: Db) {}

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.delete(tokens).where(eq(tokens.userId, userId));
  }

  async create(input: NewToken): Promise<void> {
    await this.db.insert(tokens).values(input);
  }
}
