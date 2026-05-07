import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { FastifyBaseLogger } from "fastify";
import { env } from "@/config/env";
import type { User } from "@/db/models";
import { AppError } from "@/lib/errors";
import type { TokenRepo, UserRepo } from "@/repos";

export class AuthService {
  private readonly userRepo: UserRepo;
  private readonly tokenRepo: TokenRepo;
  private readonly logger: FastifyBaseLogger;
  private readonly jwtSign: (sub: string) => string;

  constructor(opts: {
    userRepo: UserRepo;
    tokenRepo: TokenRepo;
    logger: FastifyBaseLogger;
    jwtSign: (sub: string) => string;
  }) {
    this.userRepo = opts.userRepo;
    this.tokenRepo = opts.tokenRepo;
    this.logger = opts.logger;
    this.jwtSign = opts.jwtSign;
  }

  async register(input: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ accessToken: string; user: Omit<User, "passwordHash"> }> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "Email already registered", [
        { message: "Email is already in use", field: "email" },
      ]);
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepo.create({
      email: input.email,
      passwordHash,
      name: input.name ?? null,
    });
    return {
      accessToken: this.jwtSign(user.id),
      user: this.sanitize(user),
    };
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: Omit<User, "passwordHash"> }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid credentials", [
        { message: "Invalid email or password", field: "credentials" },
      ]);
    }
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid credentials", [
        { message: "Invalid email or password", field: "credentials" },
      ]);
    }
    return {
      accessToken: this.jwtSign(user.id),
      user: this.sanitize(user),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return;
    }
    await this.tokenRepo.deleteByUserId(user.id);
    const token = randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + env.resetTokenTtlMs);
    await this.tokenRepo.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      intent: "reset_password",
    });
    this.logger.info(`Password reset token issued for email ${email}`);
  }

  private sanitize(user: User): Omit<User, "passwordHash"> {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
