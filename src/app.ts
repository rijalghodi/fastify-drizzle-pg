import cors from "@fastify/cors";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { env } from "@/config/env";
import { authenticatePlugin } from "@/plugins/authenticate";
import { diPlugin } from "@/plugins/di";
import { errorHandlerPlugin } from "@/plugins/error-handler";
import { swaggerPlugin } from "@/plugins/swagger";
import { authRoutes } from "@/routes/auth.routes";
import { healthRoutes } from "@/routes/health.routes";

export async function buildApp() {
  const app = Fastify({
    logger:
      env.nodeEnv === "development"
        ? {
            level: env.logLevel,
            transport: {
              target: "pino-pretty",
              options: { colorize: true },
            },
          }
        : { level: env.logLevel },
  }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(cors, { origin: true });
  await app.register(errorHandlerPlugin);
  await app.register(swaggerPlugin);
  await app.register(diPlugin);
  await app.register(authenticatePlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: "/auth" });

  return app;
}
