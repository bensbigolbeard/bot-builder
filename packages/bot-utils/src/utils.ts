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
  handler: (interaction: ChatInputCommandInteraction) => void;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  subcommands?: Record<string, CustomSubcommand>;
}

export interface CustomSubcommand {
  subcommand: (
    command: SlashCommandSubcommandBuilder
  ) => SlashCommandSubcommandBuilder;
  handler: (interaction: ChatInputCommandInteraction) => void;
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

export function ifElse<T>(
  predicate: (arg: T) => boolean,
  ifCond: (arg: T) => Promise<T> | T,
  elseCond: (arg: T) => Promise<T> | T
) {
  return (data: T) => (predicate(data) ? ifCond(data) : elseCond(data));
}
