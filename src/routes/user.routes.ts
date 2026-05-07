import { ApiSuccessUserSchema } from "@/schema/auth.schema";
import { ApiErrorSchema } from "@/schema/common.schema";
import type { FastifyPluginAsync } from "fastify";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userController = fastify.userController;

  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["User"],
        summary: "Current user",
        security: [{ bearerAuth: [] }],
        response: {
          200: ApiSuccessUserSchema,
          401: ApiErrorSchema,
          500: ApiErrorSchema,
        },
      },
    },
    (req, reply) => userController.me(req, reply),
  );
};
