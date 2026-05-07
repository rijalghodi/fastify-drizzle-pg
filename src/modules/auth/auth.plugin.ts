import type { FastifyPluginAsync } from "fastify";
import {
  ApiErrorSchema,
  ApiSuccessAuthSchema,
  ApiSuccessForgotSchema,
  ApiSuccessUserSchema,
  authTag,
  ForgotBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
} from "@/modules/auth/auth.schemas";

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  const { authController } = fastify.diContainer.cradle;

  fastify.post(
    "/register",
    {
      schema: {
        tags: [authTag],
        summary: "Register",
        body: RegisterBodySchema,
        response: {
          201: ApiSuccessAuthSchema,
          409: ApiErrorSchema,
          422: ApiErrorSchema,
        },
      },
    },
    (req, reply) => authController.register(req, reply),
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: [authTag],
        summary: "Login",
        body: LoginBodySchema,
        response: {
          200: ApiSuccessAuthSchema,
          401: ApiErrorSchema,
          422: ApiErrorSchema,
        },
      },
    },
    (req, reply) => authController.login(req, reply),
  );

  fastify.post(
    "/forgot-password",
    {
      schema: {
        tags: [authTag],
        summary: "Forgot password",
        body: ForgotBodySchema,
        response: {
          200: ApiSuccessForgotSchema,
          422: ApiErrorSchema,
        },
      },
    },
    (req, reply) => authController.forgotPassword(req, reply),
  );

  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: [authTag],
        summary: "Current user",
        security: [{ bearerAuth: [] }],
        response: {
          200: ApiSuccessUserSchema,
          401: ApiErrorSchema,
          500: ApiErrorSchema,
        },
      },
    },
    (req, reply) => authController.me(req, reply),
  );
};
