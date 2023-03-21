import "dotenv/config";
import { AppConfig } from "./utils";
import { REST, Routes } from "discord.js";
import { getCommands, getCommandRegistry } from "./command-registry";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT);

export const initCommands =
  ({ PLUGIN_REGISTRY }: AppConfig) =>
  async () => {
    console.log("Started refreshing application (/) commands.");
    const commands = getCommands({ PLUGIN_REGISTRY });
    const COMMAND_REGISTRY = getCommandRegistry(commands);

    await rest.put(Routes.applicationCommands(process.env.SERVER_ID), {
      body: COMMAND_REGISTRY,
    });

    console.log("Successfully reloaded application (/) commands.");
  };
