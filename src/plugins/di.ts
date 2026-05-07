import { fastifyAwilixPlugin } from "@fastify/awilix";
import fastifyJwt from "@fastify/jwt";
import { asClass, asValue } from "awilix";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "../config/env.js";
import { db } from "../infra/db/client.js";
import { AuthController } from "../modules/auth/auth.controller.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { PasswordResetRepository } from "../modules/auth/password-reset.repository.js";
import { UserRepository } from "../modules/auth/user.repository.js";
import type { JwtSign } from "../types/jwt.js";

export const diPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: false,
    injectionMode: "CLASSIC",
  });

  await fastify.register(fastifyJwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: env.jwtExpiresIn },
  });

  fastify.diContainer.register({
    db: asValue(db),
    userRepository: asClass(UserRepository).singleton(),
    passwordResetRepository: asClass(PasswordResetRepository).singleton(),
    jwtSign: asValue<JwtSign>((payload) => fastify.jwt.sign(payload)),
    logger: asValue(fastify.log),
    appEnv: asValue(env),
    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
  });
});
