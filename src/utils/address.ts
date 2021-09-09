import { bech32 } from "bech32";
import { Address, isValidPrivate, privateToAddress } from "ethereumjs-util";
import { PRIVATE_KEY } from "../config";
import { default as initWeb3 } from "./../web3";

export const getInjectiveAddress = (address: string): string => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer();

  return bech32.encode("inj", bech32.toWords(addressBuffer));
};

export const getAddressFromInjectiveAddress = (address: string): string => {
  if (address.startsWith("0x")) {
    return address;
  }

  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(address).words)
  ).toString("hex")}`;
};

export const getAddressFromPrivateKey = (): string => {
  if (!PRIVATE_KEY) {
    throw new Error("You have to provide a PRIVATE_KEY in your .env");
  }

  const privateKey = Buffer.from(PRIVATE_KEY.toString(), "hex");

  if (!isValidPrivate(privateKey)) {
    throw new Error("The PRIVATE_KEY in your .env is not valid");
  }

  return `0x${privateToAddress(privateKey).toString("hex")}`;
};

export const validateAddress = (address: string): boolean => {
  const web3Strategy = initWeb3();
  const web3 = web3Strategy.getWeb3();

  try {
    return !!web3.utils.isAddress(address);
  } catch (e) {
    throw new Error(`Your address ${address} is not valid`);
  }
};

export const validateInjectiveAddress = (injectiveAddress: string): boolean => {
  const address = getAddressFromInjectiveAddress(injectiveAddress);

  try {
    return validateAddress(address);
  } catch (e) {
    throw new Error(`Your Injective address ${injectiveAddress} is not valid`);
  }
};
