import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@/lib/errors";
import { sendSuccess } from "@/lib/response";

export class UserController {
  constructor() {}

  async me(request: FastifyRequest, reply: FastifyReply) {
    if (!request.currentUser) {
      throw new AppError(500, "Auth state invalid", [
        { message: "User not loaded after authentication", field: "auth" },
      ]);
    }
    return sendSuccess(reply, "OK", request.currentUser);
  }
}
