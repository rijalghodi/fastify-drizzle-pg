import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

const HealthDataSchema = Type.Object({
  status: Type.Literal("up"),
});

const HealthResponseSchema = Type.Object({
  ok: Type.Literal(true),
  message: Type.String(),
  data: HealthDataSchema,
});

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check",
        response: { 200: HealthResponseSchema },
      },
    },
    async (_request, reply) => {
      return reply.send({
        ok: true,
        message: "OK",
        data: { status: "up" as const },
      });
    },
  );
};
