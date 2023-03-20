import { CommandPlugin } from "bensbigolbeard-bot-utils";
import { ContractPlugin } from "bensbigolbeard-contract-tools";
import { PLUGIN_REGISTRY as plugins } from "../plugin-registry.js";

// assigns the supported types, so types are available, even if not all of the plugin types are registered
export const PLUGIN_REGISTRY: (CommandPlugin | ContractPlugin)[] = plugins;
