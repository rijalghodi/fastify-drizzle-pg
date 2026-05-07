import type { FastifyPluginAsync } from "fastify";
import {
  ApiErrorSchema,
  ApiSuccessAuthSchema,
  ApiSuccessForgotSchema,
  authTag,
  ForgotBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
} from "@/schema";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const { authController } = fastify;

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
};
