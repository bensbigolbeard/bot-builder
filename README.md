# Discord Bot Builder

This is a set of base utility plugins and bot client server application to host them, backed by `discord.js`. 

## Project structure:
- apps
  - automaton (Discord bot application)
  - example-integration (Demonstrates how to initialize the bot)
- packages
  - base-utils (definitions of plugin structures and utils)
  - contract-utils (plugin providing ethereum contract interation utils)

## Bot structure:
The only thing you need to do once you've built your plugin(s) is to register them in a file that exports an array of your imported. You can then supply the bot with the path to this file:
- `my-app`
  - `my-plugin-registry.js`
    - `module.exports = [ custom-plugin-1, custom-plugin-2 ];`
  - `index.js`
    - `startBot({ pathToPlugins: path.join(__dirname, 'my-plugin-registry.js') })`

### Env Variables
This project used `dot-env` to manage environmental secrets. To test locally, you need a `.env` file with the keys found in `.env-example`. 

At the very least, you need to populate the `DISCORD_BOT_*` keys, but if you also need to utilize `contract-utils`, then you will need API keys for Etherscan and Alchemy.

### SSL/TLS Certs
By default, the bot will run on `http` in `production` mode on port `80`. If you want to run the bot in production with `https` on port `443`, you need to generate your certs with these filenames:
- `cert.pem`
- `key.pem`

Then you can supply the path to your certs directory:
- `my-app`
  - `certs`
    - `cert.pem`
    - `key.pem`
  - `index.js`
    - `startBot({ pathToPlugins, pathToCerts: path.join(__dirname, 'certs') })`

# Bot-utils
## Plugin structure
The top-level plugin API looks like this:
```ts
interface CommandPlugin {
  COMMANDS: Record<string, CustomCommand>;
  initRoutes?: (app: FastifyInstance) => FastifyInstance;
}
```
The main usage is for registering Discord slash commands, but since the bot application is backed by a Fastify server and the app instance is passed directly to `initRoutes`. That means you can register application routes as well, to create anything from API endpoints to full web apps. 

## Command structure

```ts
interface CustomSlashCommand {
  name: string;
  handler: (interaction: ChatInputCommandInteraction) => void;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  subcommands?: Record<
    string,
    (interaction: ChatInputCommandInteraction) => void
  >;
}
```
`command` defines the options for your command, like its name. description, input requirements, etc. 

`handler` recieves the user's command input and assembles a response.

`autocomplete` (***optional***) recieves the user's partially completed inputs so you can narrow down a list of input options.

`subcommands` (***optional***) a map of additional commands nested under a top-level command to help organize similar functionality.

## Subcommand structure
The subcommand interface is essentially the stripped-down version of the command interface:
```ts
export interface CustomSubcommand {
  subCommand: (
    command: SlashCommandSubcommandBuilder
  ) => SlashCommandSubcommandBuilder;
  handler: (interaction: ChatInputCommandInteraction) => void;
}
```
`subcommand` defines the options for your command, like its name. description, input requirements, etc, but using the `SlashCommandSubcommandBuilder` from `discord.js`

`handler` recieves the user's command input and assembles a response.

To register subcommands, you can pass the `subcommand` directly to `SlashCommandBuilder`'s `addSubcommand` method.

```ts
const myCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAME)
  .setDescription(COMMAND_DESCRIPTION)
  .addSubcommand(mySubCommand.subCommand)
  .toJSON();
```

# Contract-utils
(***TODO***)