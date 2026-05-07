import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthController, UserController } from "@/controllers";
import type { User } from "@/db/models";
import type { UserRepo, TokenRepo } from "@/repos";
import type { AuthService } from "@/services";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    userRepo: UserRepo;
    tokenRepo: TokenRepo;
    authService: AuthService;
    authController: AuthController;
    userController: UserController;
  }

  interface FastifyRequest {
    currentUser?: Omit<User, "passwordHash">;
  }
}
