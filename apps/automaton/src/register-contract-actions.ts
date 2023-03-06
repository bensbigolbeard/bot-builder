import { CommandPlugin } from "bot-base";
import { ContractPlugin, ContractAction } from "contract-tools";
import { pipe } from "froebel";
import { FastifyInstance } from "fastify";
import { initContract } from "contract-tools";
import { PLUGIN_REGISTRY } from "./utils";

export const initTools = async (api: ContractAction) => {
  await pipe(initContract, api.handler)(api);
};

export const initContractTools = (app: FastifyInstance) => {
  return Promise.all(
    PLUGIN_REGISTRY.filter(
      (plugin): plugin is ContractPlugin => "CONTRACT_ACTIONS" in plugin
    ).flatMap((plugin) =>
      plugin.CONTRACT_ACTIONS?.length
        ? plugin.CONTRACT_ACTIONS.map(initTools)
        : []
    )
  );
};
