import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../infra/db/schema/users.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyRequest {
    currentUser?: Omit<User, "passwordHash">;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: { sub: string };
  }
}
