import { CommandPlugin, CustomCommand } from "bensbigolbeard-bot-utils";
import { AppConfig } from "./utils";

export const getCommands = ({ PLUGIN_REGISTRY }: AppConfig) =>
  PLUGIN_REGISTRY.filter(
    (plugin): plugin is CommandPlugin => "COMMANDS" in plugin
  ).reduce(
    (commandObj, command) => ({ ...commandObj, ...command.COMMANDS }),
    {} as CommandPlugin["COMMANDS"]
  );

export const getCommandRegistry = (commands: Record<string, CustomCommand>) =>
  Object.values(commands).map((cmd) => cmd.command);
