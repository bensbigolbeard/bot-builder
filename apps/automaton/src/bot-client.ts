import "dotenv/config";
import { AppConfig } from "./utils";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { getCommands } from "./command-registry";

export const initClient =
  ({ PLUGIN_REGISTRY }: AppConfig) =>
  async () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const commands = getCommands({ PLUGIN_REGISTRY });

    client.on(Events.ClientReady, () => {
      console.log(`Logged in as ${client.user?.tag ?? "frickin nobody"}!`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
        return;
      }
      for (const command in commands) {
        const cmnd = commands[command as keyof typeof commands]; // ugh, TS hates some iterators, apparently
        if (interaction.commandName === cmnd?.name) {
          if (interaction.isAutocomplete()) {
            if (cmnd?.autocomplete) {
              await cmnd.autocomplete(interaction);
            }
          } else if (cmnd.subcommands) {
            const subcommand = interaction.options.getSubcommand();

            return Object.keys(cmnd.subcommands).includes(subcommand)
              ? await cmnd.subcommands[subcommand].handler(interaction)
              : undefined;
          } else {
            await cmnd.handler(interaction);
          }
        }
      }
    });

    await client.login(process.env.DISCORD_BOT_PRIVATE_KEY);
  };
