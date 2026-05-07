import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { verifyAccessToken } from "@/lib/sign-access-token";

export const authenticatePlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      let userId: string | undefined;
      try {
        const token = request.headers.authorization?.split(" ")[1] ?? "";
        userId = await verifyAccessToken(token);
      } catch {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized. Invalid or expired token",
          data: null,
        });
      }

      const user = await fastify.userRepository.findById(userId);
      if (!user) {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized. User no longer exists",
          data: null,
        });
      }
      request.currentUser = {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
  );
});
