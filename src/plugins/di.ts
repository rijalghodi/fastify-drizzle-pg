import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "@/config/env";
import { AuthController } from "@/controllers/auth.controller";
import { db } from "@/db/client";
import { TokenRepo } from "@/repos/token.repo";
import { UserRepo } from "@/repos/user.repo";
import { AuthService } from "@/services/auth.service";

export const diPlugin = fp(async (fastify: FastifyInstance) => {
  const userRepo = new UserRepo(db);
  const tokenRepo = new TokenRepo(db);

  await fastify.register(fastifyJwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: env.jwtExpiresIn },
  });

  const authService = new AuthService({
    userRepo,
    tokenRepo,
    jwtSign: (payload: { sub: string }) => fastify.jwt.sign(payload),
    logger: fastify.log,
    appEnv: env,
  });
  const authController = new AuthController(authService);

  fastify.decorate("userRepo", userRepo);
  fastify.decorate("tokenRepo", tokenRepo);
  fastify.decorate("authService", authService);
  fastify.decorate("authController", authController);
});
