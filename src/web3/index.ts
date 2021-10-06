import { Web3Exception } from "@injectivelabs/exceptions";
import { ChainId } from "@injectivelabs/ts-types";
import Web3 from "web3";
import { CHAIN_ID, ALCHEMY_KOVAN_KEY, ALCHEMY_KEY } from "../config";

const initWeb3 = (): Web3 => {
  if (ChainId.Kovan.toString() === CHAIN_ID.toString() && !ALCHEMY_KOVAN_KEY) {
    throw new Web3Exception("You need to set ALCHEMY_KOVAN_KEY in your .env");
  }

  if (ChainId.Mainnet.toString() === CHAIN_ID.toString() && !ALCHEMY_KEY) {
    throw new Web3Exception("You need to set ALCHEMY_KOVAN_KEY in your .env");
  }

  const rpcUrl =
    CHAIN_ID.toString() === ChainId.Kovan.toString()
      ? `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KOVAN_KEY}`
      : `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`;

  return new Web3(new Web3.providers.HttpProvider(rpcUrl));
};

export const web3 = initWeb3();
export default initWeb3;
