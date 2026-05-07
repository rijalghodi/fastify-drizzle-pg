import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "../config/env.js";

export const swaggerPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: { title: "fastify-drizzle-pg", version: "0.1.0" },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });
  const docsEnabled = env.nodeEnv !== "production";
  if (docsEnabled) {
    await fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });
  }
});
