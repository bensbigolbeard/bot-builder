import { CommandPlugin } from "bot-base";
import { PLUGIN_REGISTRY } from "./utils";

export const commands = PLUGIN_REGISTRY.filter(
  (plugin): plugin is CommandPlugin => "COMMANDS" in plugin
).reduce(
  (commandObj, command) => ({ ...commandObj, ...command.COMMANDS }),
  {} as CommandPlugin["COMMANDS"]
);

export const COMMAND_REGISTRY = Object.values(commands).map(
  (cmd) => cmd.command
);
