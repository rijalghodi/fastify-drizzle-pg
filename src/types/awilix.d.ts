import type { FastifyBaseLogger } from "fastify";
import type { env } from "../config/env.js";
import type { Db } from "../infra/db/client.js";
import type { AuthController } from "../modules/auth/auth.controller.js";
import type { AuthService } from "../modules/auth/auth.service.js";
import type { PasswordResetRepository } from "../modules/auth/password-reset.repository.js";
import type { UserRepository } from "../modules/auth/user.repository.js";
import type { JwtSign } from "./jwt.js";

declare module "@fastify/awilix" {
  interface Cradle {
    db: Db;
    userRepository: UserRepository;
    passwordResetRepository: PasswordResetRepository;
    jwtSign: JwtSign;
    logger: FastifyBaseLogger;
    appEnv: typeof env;
    authService: AuthService;
    authController: AuthController;
  }
}
