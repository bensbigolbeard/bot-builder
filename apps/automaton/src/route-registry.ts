import type { CommandPlugin } from "bensbigolbeard-bot-utils";
import type { FastifyInstance } from "fastify";
import type { AppConfig } from "./utils";

export const initRoutes = (
  app: FastifyInstance,
  { PLUGIN_REGISTRY }: AppConfig
) =>
  PLUGIN_REGISTRY.filter(
    (plugin): plugin is CommandPlugin => "COMMANDS" in plugin
  ).reduce(
    (appWithExtensions, plugin) =>
      plugin.initRoutes?.(appWithExtensions) ?? app,
    app
  );
