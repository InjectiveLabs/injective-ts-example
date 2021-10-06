import { getUrlEndpointForNetwork, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { config } from "dotenv";

config();

const NETWORK = (process.env.NETWORK || Network.Devnet) as Network;
const CHAIN_ID = (process.env.CHAIN_ID || ChainId.Kovan) as ChainId;
const INJECTIVE_CHAIN_ID = "injective-1";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const ALCHEMY_KOVAN_KEY = process.env.ALCHEMY_KOVAN_KEY;

const endpoints = getUrlEndpointForNetwork(NETWORK);
const SENTRY_URL = (process.env.SENTRY_URL || endpoints.chainUrl) as string;

export {
  NETWORK,
  CHAIN_ID,
  INJECTIVE_CHAIN_ID,
  ALCHEMY_KEY,
  ALCHEMY_KOVAN_KEY,
  SENTRY_URL,
  PRIVATE_KEY,
};
