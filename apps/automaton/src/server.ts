import path from "path";
import { pipe } from "froebel";
import { fastify, FastifyError } from "fastify";
import { readFile } from "fs/promises";
import { initClient } from "./bot-client";
import { initRoutes } from "./route-registry";
import { initCommands } from "./register-commands";

const isProd = process.env.NODE_ENV === "production";

const startServer = async () => {
  const app = fastify({
    logger: true,
    https: {
      key: await readFile(path.join(__dirname, "../certs/key.pem")),
      cert: await readFile(path.join(__dirname, "../certs/cert.pem")),
    },
  });

  app.get("/", async (request, reply) => {
    return reply.code(200);
  });

  // initialize any plugin-defined routes (or app extensions)
  initRoutes(app);

  return app;
};

try {
  pipe(
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

    initClient,
    initCommands
  )();
} catch (e) {
  console.error("startupError:", e);
}
