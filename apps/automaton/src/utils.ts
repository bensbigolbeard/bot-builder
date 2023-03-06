import { CommandPlugin } from "bot-base";
import { ContractPlugin } from "contract-tools";
import { PLUGIN_REGISTRY as plugins } from "../plugin-registry.js";

// assigns the supported types, so types are available, even if not all of the plugin types are registered
export const PLUGIN_REGISTRY: (CommandPlugin | ContractPlugin)[] = plugins;
