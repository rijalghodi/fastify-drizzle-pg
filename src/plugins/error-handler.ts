import type { FastifyError, FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { AppError } from "@/lib/errors";

function isValidationError(err: unknown): err is FastifyError & {
  validation: {
    instancePath?: string;
    message?: string;
    params?: { missingProperty?: string };
  }[];
} {
  return (
    typeof err === "object" &&
    err !== null &&
    "validation" in err &&
    Array.isArray((err as FastifyError).validation)
  );
}

export const errorHandlerPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((err: unknown, request, reply) => {
    if (reply.sent) return;
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({
        ok: false,
        message: err.message,
        data: null,
        details: err.details,
      });
    }
    if (isValidationError(err)) {
      const details = err.validation.map((v) => ({
        message: v.message ?? "Invalid value",
        field:
          v.instancePath?.replace(/^\//, "").replace(/\//g, ".") ||
          v.params?.missingProperty ||
          "body",
      }));
      return reply.status(422).send({
        ok: false,
        message: "Validation failed",
        data: null,
        details,
      });
    }
    const fastifyErr = err as FastifyError;
    const statusCode = fastifyErr.statusCode ?? 500;
    if (statusCode >= 500) {
      request.log.error({ err: fastifyErr }, "Unhandled error");
    }
    return reply.status(statusCode).send({
      ok: false,
      message:
        statusCode >= 500
          ? "Internal server error"
          : (fastifyErr.message ?? "Error"),
      data: null,
    });
  });
});
