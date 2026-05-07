import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthController, UserController } from "@/controllers";
import type { User } from "@/db/models";
import type { UserRepo } from "@/repos";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    userRepo: UserRepo;
    authController: AuthController;
    userController: UserController;
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
