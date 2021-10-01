import { getUrlEndpointForNetwork, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { config } from "dotenv";

config();

const NETWORK = (process.env.NETWORK || Network.Devnet) as Network;
const CHAIN_ID = (process.env.CHAIN_ID || ChainId.Kovan) as ChainId;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const ALCHEMY_KOVAN_KEY = process.env.ALCHEMY_KOVAN_KEY;
const IS_TESTNET = [Network.Devnet, Network.Testnet].includes(NETWORK);

const endpoints = getUrlEndpointForNetwork(NETWORK);
const EXCHANGE_URL = (process.env.EXCHANGE_URL ||
  endpoints.exchangeUrl) as string;
const SENTRY_URL = (process.env.SENTRY_URL || endpoints.chainUrl) as string;

export {
  NETWORK,
  CHAIN_ID,
  IS_TESTNET,
  ALCHEMY_KEY,
  ALCHEMY_KOVAN_KEY,
  EXCHANGE_URL,
  SENTRY_URL,
  PRIVATE_KEY,
};
