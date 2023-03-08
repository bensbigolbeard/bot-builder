import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./command-registry";

export const initClient = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
          if ("autocomplete" in cmnd) {
            await cmnd.autocomplete(interaction);
          }
        } else if ("subCommands" in cmnd) {
          const subCommand = interaction.options.getSubcommand();

          return Object.keys(cmnd.subCommands).includes(subCommand)
            ? await cmnd.subCommands[subCommand](interaction)
            : undefined;
        } else {
          await cmnd.handler(interaction);
        }
      }
    }
  });

  await client.login(process.env.DISCORD_BOT);
};
