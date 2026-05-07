import type { Static } from "@sinclair/typebox";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../lib/errors.js";
import { sendSuccess } from "../../lib/response.js";
import type {
  ForgotBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
} from "./auth.schemas.js";
import type { AuthService } from "./auth.service.ts";

type RegisterBody = Static<typeof RegisterBodySchema>;
type LoginBody = Static<typeof LoginBodySchema>;
type ForgotBody = Static<typeof ForgotBodySchema>;

export class AuthController {
  private authService: AuthService;

  constructor({ authService }: { authService: AuthService }) {
    this.authService = authService;
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as RegisterBody;
    const result = await this.authService.register(body);
    return sendSuccess(reply, "Registered", result, 201);
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as LoginBody;
    const result = await this.authService.login(body);
    return sendSuccess(reply, "Logged in", result);
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as ForgotBody;
    await this.authService.forgotPassword(body.email);
    return sendSuccess(
      reply,
      "If an account exists for that email, instructions have been sent.",
      null,
    );
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    if (!request.currentUser) {
      throw new AppError(500, "Auth state invalid", [
        { message: "User not loaded after authentication", field: "auth" },
      ]);
    }
    return sendSuccess(reply, "OK", request.currentUser);
  }
}
