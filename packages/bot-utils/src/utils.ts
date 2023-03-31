import { FastifyInstance } from "fastify";
import { pipe } from "froebel";
import fetch from "isomorphic-fetch";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandSubcommandBuilder,
} from "discord.js";

/* Custom Command Interface */

export interface CustomCommand {
  name: string;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
}
export interface CustomCommandBasic extends CustomCommand {
  handler: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
}
export interface CustomCommandWithSubcommands extends CustomCommand {
  subcommands: Record<string, CustomSubcommand["handler"]>;
}

export interface CustomSubcommand {
  handler: (interaction: ChatInputCommandInteraction) => void;
  subcommand: (
    command: SlashCommandSubcommandBuilder
  ) => SlashCommandSubcommandBuilder;
}

export interface CommandPlugin {
  COMMANDS: Record<string, CustomCommand>;
  initRoutes?: (app: FastifyInstance) => FastifyInstance;
}

/* Asset Fetching Utils */

export const fetchTokenMeta = pipe(fetch, (res: Response) => res.json());

/* General Utils */

export function tap<T>(msg: string) {
  return (v: T): T => {
    console.log(`*** ${msg}`, v);
    return v;
  };
}

export function ifElse<T, U, V>(
  predicate: (arg: T) => boolean,
  ifCond: (arg: T) => U,
  elseCond: (arg: T) => V
) {
  return (data: T, ...args: unknown[]) =>
    predicate(data) ? ifCond(data) : elseCond(data);
}
