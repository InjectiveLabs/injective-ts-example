import { default as initWeb3 } from "./../web3";
import { PRIVATE_KEY } from "../config";
import { Account } from "web3-core";
import { getInjectiveAddress } from "../utils/address";

export const generateWallet = (): Account => {
  const web3Strategy = initWeb3();
  const web3 = web3Strategy.getWeb3();

  try {
    return web3.eth.accounts.create();
  } catch (e) {
    throw new Error(e.message);
  }
};

export const generateWalletFromPrivateKey = (
  privateKey: string | undefined = PRIVATE_KEY
): Account => {
  if (!privateKey) {
    throw new Error("The private key is not defined");
  }

  const web3Strategy = initWeb3();
  const web3 = web3Strategy.getWeb3();

  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deriveAddressFromPublicKey = (publicKey: string): string => {
  const web3Strategy = initWeb3();
  const web3 = web3Strategy.getWeb3();

  try {
    return `0x${web3.utils.keccak256(publicKey).slice(24 + 2)}`;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deriveInjectiveAddressFromPublicKey = (
  publicKey: string
): string => {
  const address = deriveAddressFromPublicKey(publicKey);

  return getInjectiveAddress(address);
};
