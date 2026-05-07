import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthController } from "@/controllers/auth.controller";
import type { User } from "@/infra/db/schema/users";
import type { PasswordResetRepository } from "@/repos/password-reset.repository";
import type { UserRepository } from "@/repos/user.repository";
import type { AuthService } from "@/services/auth.service";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    userRepository: UserRepository;
    passwordResetRepository: PasswordResetRepository;
    authService: AuthService;
    authController: AuthController;
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
