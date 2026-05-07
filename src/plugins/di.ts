import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { AuthController } from "@/controllers/auth.controller";
import { UserController } from "@/controllers/user.controller";
import { db } from "@/db/client";
import { TokenRepo } from "@/repos/token.repo";
import { UserRepo } from "@/repos/user.repo";
import { AuthService } from "@/services/auth.service";

export const diPlugin = fp(async (fastify: FastifyInstance) => {
  const userRepo = new UserRepo(db);
  const tokenRepo = new TokenRepo(db);

  const authService = new AuthService({
    userRepo,
    tokenRepo,
    logger: fastify.log,
  });
  const authController = new AuthController(authService);
  const userController = new UserController();

  fastify.decorate("userRepo", userRepo);
  fastify.decorate("tokenRepo", tokenRepo);
  fastify.decorate("authService", authService);
  fastify.decorate("authController", authController);
  fastify.decorate("userController", userController);
});
