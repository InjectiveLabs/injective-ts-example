import { PRIVATE_KEY } from "../config";
import { Account } from "web3-core";
import Web3Utils from "web3-utils";
import { getInjectiveAddress } from "./address";
import { web3 } from "../web3";

export const generateWallet = (): Account => {
  try {
    return web3.eth.accounts.create();
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const generateWalletFromPrivateKey = (
  privateKey: string | undefined = PRIVATE_KEY
): Account => {
  if (!privateKey) {
    throw new Error("You need to set PRIVATE_KEY in your .env");
  }

  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const deriveAddressFromPublicKey = (publicKey: string): string => {
  try {
    return `0x${Web3Utils.keccak256(publicKey).slice(24 + 2)}`;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const deriveInjectiveAddressFromPublicKey = (
  publicKey: string
): string => {
  const address = deriveAddressFromPublicKey(publicKey);

  return getInjectiveAddress(address);
};
