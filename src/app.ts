import cors from "@fastify/cors";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { env } from "@/config/env";
import { authPlugin } from "@/modules/auth/auth.plugin";
import { authenticatePlugin } from "@/plugins/authenticate";
import { diPlugin } from "@/plugins/di";
import { errorHandlerPlugin } from "@/plugins/error-handler";
import { swaggerPlugin } from "@/plugins/swagger";
import { healthPlugin } from "@/routes/health.plugin";

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
  await app.register(healthPlugin);
  await app.register(authPlugin, { prefix: "/auth" });

  return app;
}
