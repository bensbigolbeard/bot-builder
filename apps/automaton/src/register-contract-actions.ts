import {
  ContractPlugin,
  ContractAction,
  initContract,
} from "bensbigolbeard-contract-tools";
import { pipe } from "froebel";
import { FastifyInstance } from "fastify";
import { AppConfig } from "./utils";

export const initTools = async (api: ContractAction) => {
  await pipe(initContract, api.handler)(api);
};

export const initContractTools = (
  app: FastifyInstance,
  { PLUGIN_REGISTRY }: AppConfig
) => {
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
