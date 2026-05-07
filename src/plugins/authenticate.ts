import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const authenticatePlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized. Invalid or expired token",
          data: null,
        });
      }
      const userId = request.user?.sub;
      if (!userId) {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized. Invalid token payload",
          data: null,
        });
      }

      const user = await fastify.userRepo.findById(userId);
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
