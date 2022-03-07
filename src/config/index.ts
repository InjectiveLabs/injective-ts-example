import { getUrlEndpointForNetwork, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { config } from "dotenv";

config();

const NETWORK = (process.env.NETWORK || Network.Public) as Network;
const CHAIN_ID = (process.env.CHAIN_ID || ChainId.Mainnet) as ChainId;
const INJECTIVE_CHAIN_ID = [
  Network.Public,
  Network.Mainnet,
  Network.MainnetOld,
].includes(NETWORK)
  ? "injective-1"
  : NETWORK === Network.Devnet
  ? "injective-777"
  : "injective-888";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const endpoints = getUrlEndpointForNetwork(NETWORK);
const SENTRY_URL = (process.env.SENTRY_URL ||
  endpoints.sentryGrpcApi) as string;
const EXCHANGE_API_URL = (process.env.EXCHANGE_API_URL ||
  endpoints.exchangeApi) as string;

export {
  NETWORK,
  CHAIN_ID,
  INJECTIVE_CHAIN_ID,
  EXCHANGE_API_URL,
  SENTRY_URL,
  PRIVATE_KEY,
};
