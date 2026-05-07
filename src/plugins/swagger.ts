import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "@/config/env";

export const swaggerPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Fastify Drizzle PostgreSQL boilerplate",
        version: "0.1.0",
        description:
          "API documentation for the Fastify Drizzle PostgreSQL boilerplate",
        contact: {
          name: "Rijal Ghodi",
          email: "rijalghodi.dev@gmail.com",
          url: "https://rijalghodi.xyz",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
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
