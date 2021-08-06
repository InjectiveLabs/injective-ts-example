import { ChainId } from "@injectivelabs/ts-types";
import { Wallet, Web3Strategy } from "@injectivelabs/web3-strategy";
import {
  ALCHEMY_KEY,
  ALCHEMY_KOVAN_KEY,
  CHAIN_ID,
  PRIVATE_KEY,
} from "../config";

export const getRpcUrlsForChainIds = (): Record<ChainId, string> => {
  return {
    [ChainId.Ganache]: "http://localhost:8545",
    [ChainId.HardHat]: "http://localhost:8545",
    [ChainId.Kovan]: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KOVAN_KEY}`,
    [ChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    [ChainId.Injective]: "",
    [ChainId.Rinkeby]: "",
    [ChainId.Ropsten]: "",
  };
};

export const getRpcWsUrlsForChainIds = (): Record<ChainId, string> => {
  return {
    [ChainId.Ganache]: "ws://localhost:1318",
    [ChainId.HardHat]: "ws://localhost:1318",
    [ChainId.Kovan]: `wss://eth-kovan.ws.alchemyapi.io/v2/${ALCHEMY_KOVAN_KEY}`,
    [ChainId.Mainnet]: `wss://eth-mainnet.ws.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    [ChainId.Injective]: "",
    [ChainId.Rinkeby]: "",
    [ChainId.Ropsten]: "",
  };
};

const init = (): Web3Strategy => {
  if (!PRIVATE_KEY) {
    throw new Error("You have to provide a PRIVATE_KEY in your .env");
  }

  if (!ALCHEMY_KEY && parseInt(CHAIN_ID.toString()) === ChainId.Mainnet) {
    throw new Error("You have to provide a ALCHEMY_KEY in your .env");
  }

  if (!ALCHEMY_KOVAN_KEY && parseInt(CHAIN_ID.toString()) === ChainId.Kovan) {
    throw new Error("You have to provide a ALCHEMY_KOVAN_KEY in your .env");
  }

  return new Web3Strategy({
    wallet: Wallet.PrivateKey,
    chainId: parseInt(CHAIN_ID.toString()),
    options: {
      privateKey: PRIVATE_KEY,
      wsRpcUrls: getRpcWsUrlsForChainIds(),
      rpcUrls: getRpcUrlsForChainIds(),
      pollingInterval: 4000,
      blockTracker: false,
    },
  });
};

export default init;
