import { CommandPlugin } from "bot-base";
import { FastifyInstance } from "fastify";
import { PLUGIN_REGISTRY } from "./utils";

export const initRoutes = (app: FastifyInstance) =>
  PLUGIN_REGISTRY.filter(
    (plugin): plugin is CommandPlugin => "COMMANDS" in plugin
  ).reduce(
    (appWithExtensions, plugin) =>
      plugin.initRoutes?.(appWithExtensions) ?? app,
    app
  );
