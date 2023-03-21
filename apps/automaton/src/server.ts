import { PluginRegistry, AppConfig } from "./utils";
import path from "path";
import { pipe } from "froebel";
import { fastify, FastifyError } from "fastify";
import { readFile } from "fs/promises";
import { initClient } from "./bot-client";
import { initRoutes } from "./route-registry";
import { initCommands } from "./register-commands";

const isProd = process.env.NODE_ENV === "production";

type BotBuilderConfig = {
  pathToCerts: string;
  pathToPlugins: string;
};

const startServer = async ({
  pathToCerts,
  PLUGIN_REGISTRY,
}: BotBuilderConfig & AppConfig) => {
  const app = fastify({
    logger: true,
    https: {
      key: await readFile(path.join(pathToCerts, "key.pem")),
      cert: await readFile(path.join(pathToCerts, "cert.pem")),
    },
  });

  app.get("/", async (request, reply) => {
    return reply.code(200);
  });

  // initialize any plugin-defined routes (or app extensions)
  initRoutes(app, { PLUGIN_REGISTRY });

  return app;
};

export const startBot = async (config: BotBuilderConfig) => {
  try {
    const PLUGIN_REGISTRY = require(config.pathToPlugins) as PluginRegistry;
    if (!PLUGIN_REGISTRY) {
      throw new Error("No plugin registry found.");
    }
    const appConfig = { PLUGIN_REGISTRY };

    await pipe(
      /* @ts-ignore: no clue why it thinks this arg is type `never`. still works */
      startServer,
      (app) =>
        app.listen(
          { port: isProd ? 443 : 3333, host: "::" },
          (err: FastifyError) => {
            console.log(app.printRoutes());
            if (err) {
              app.log.error(err);
              process.exit(1);
            }
          }
        ),
      initClient(appConfig),
      initCommands(appConfig)
    )({ ...config, ...appConfig });
  } catch (e) {
    console.error("startupError:", e);
  }
};
