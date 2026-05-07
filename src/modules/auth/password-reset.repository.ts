import { eq } from "drizzle-orm";
import type { Db } from "../../infra/db/client.js";
import {
  type NewPasswordResetToken,
  passwordResetTokens,
} from "../../infra/db/schema/password-reset-tokens.js";

export class PasswordResetRepository {
  private db: Db;

  constructor({ db }: { db: Db }) {
    this.db = db;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  }

  async create(input: NewPasswordResetToken): Promise<void> {
    await this.db.insert(passwordResetTokens).values(input);
  }
}
