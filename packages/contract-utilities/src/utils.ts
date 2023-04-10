import "dotenv/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import fetch from "isomorphic-fetch";
import {
  BASE_OPENSEA_URL,
  BASE_ALCHEMY_URL,
  BASE_ETHERSCAN_URL,
} from "./constants";

export type InitializedContract = {
  web3: Web3;
  contract: any;
};

export interface ContractAction {
  address: string;
  // todo: find the type for web3.js Contract
  handler: ({ web3, contract }: InitializedContract) => Promise<typeof Web3>;
}

export interface ContractPlugin {
  CONTRACT_ACTIONS: ContractAction[];
}

/* Asset Fetching Utils */

export const formatCollectionUrl = (contract: string) =>
  `${BASE_OPENSEA_URL}${contract}`;

/* General Utils */

export const initContract: (
  obj: ContractAction
) => Promise<InitializedContract> = async (apiObj) => {
  const response = await fetch(
    BASE_ETHERSCAN_URL.concat(
      "?module=contract",
      "&action=getabi",
      `&address=${apiObj.address}`,
      `&apikey=${process.env.ETHERSCAN_API_KEY}`
    )
  );

  if (!response.ok) throw new Error("response bad");

  const abiSourceString: string = (await response.json())?.result;
  if (!abiSourceString) throw new Error("no abi value");
  const abiSource: AbiItem[] = JSON.parse(abiSourceString);

  const providerEndpoint = `${BASE_ALCHEMY_URL}${process.env.ALCHEMY_API_KEY}`;
  const web3 = new Web3(providerEndpoint);

  const contract = new web3.eth.Contract(abiSource, apiObj.address);

  return { web3, contract };
};
