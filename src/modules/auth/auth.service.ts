import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { FastifyBaseLogger } from "fastify";
import type { env } from "../../config/env.js";
import type { User } from "../../infra/db/schema/users.js";
import { AppError } from "../../lib/errors.js";
import type { JwtSign } from "../../types/jwt.js";
import type { PasswordResetRepository } from "./password-reset.repository.js";
import type { UserRepository } from "./user.repository.js";

export class AuthService {
  private userRepository: UserRepository;
  private passwordResetRepository: PasswordResetRepository;
  private jwtSign: JwtSign;
  private logger: FastifyBaseLogger;
  private appEnv: typeof env;

  constructor({
    userRepository,
    passwordResetRepository,
    jwtSign,
    logger,
    appEnv,
  }: {
    userRepository: UserRepository;
    passwordResetRepository: PasswordResetRepository;
    jwtSign: JwtSign;
    logger: FastifyBaseLogger;
    appEnv: typeof env;
  }) {
    this.userRepository = userRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.jwtSign = jwtSign;
    this.logger = logger;
    this.appEnv = appEnv;
  }

  async register(input: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ accessToken: string; user: Omit<User, "passwordHash"> }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "Email already registered", [
        { message: "Email is already in use", field: "email" },
      ]);
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name ?? null,
    });
    return {
      accessToken: this.jwtSign({ sub: user.id }),
      user: this.sanitize(user),
    };
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: Omit<User, "passwordHash"> }> {
    const user = await this.userRepository.findByEmail(input.email);
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
      accessToken: this.jwtSign({ sub: user.id }),
      user: this.sanitize(user),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    await this.passwordResetRepository.deleteByUserId(user.id);
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + this.appEnv.resetTokenTtlMs);
    await this.passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });
    this.logger.info(
      { email, resetToken: token },
      "Password reset token issued (deliver via email in production)",
    );
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
