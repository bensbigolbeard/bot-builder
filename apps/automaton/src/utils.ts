import { CommandPlugin } from "bensbigolbeard-bot-utils";
import { ContractPlugin } from "bensbigolbeard-contract-tools";

export type PluginRegistry = (CommandPlugin | ContractPlugin)[];
export type AppConfig = {
  PLUGIN_REGISTRY: PluginRegistry;
};
