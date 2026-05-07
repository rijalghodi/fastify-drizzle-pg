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
          message: "Unauthorized",
          data: null,
          details: [
            {
              message: "Invalid or expired token",
              field: "authorization",
            },
          ],
        });
      }
      const subRaw = request.user?.sub;
      if (!subRaw) {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized",
          data: null,
          details: [
            { message: "Invalid token payload", field: "authorization" },
          ],
        });
      }
      const user =
        await fastify.diContainer.cradle.userRepository.findById(subRaw);
      if (!user) {
        return reply.status(401).send({
          ok: false,
          message: "Unauthorized",
          data: null,
          details: [
            { message: "User no longer exists", field: "authorization" },
          ],
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
