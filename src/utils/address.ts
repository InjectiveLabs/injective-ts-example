import secp256k1 from "secp256k1";
import { bech32 } from "bech32";
import { Address, isValidPrivate, privateToAddress } from "ethereumjs-util";
import { PRIVATE_KEY } from "../config";
import { getAddressFromInjectiveAddress, validateAddress } from "./wallet";

export const getInjectiveAddress = (address: string): string => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer();

  return bech32.encode("inj", bech32.toWords(addressBuffer));
};

export const getAddressFromPrivateKey = (
  privateKey: string | undefined = PRIVATE_KEY
): string => {
  if (!privateKey) {
    throw new Error("You have to provide a PRIVATE_KEY in your .env");
  }

  const privateKeyHex = Buffer.from(privateKey.toString(), "hex");

  if (!isValidPrivate(privateKeyHex)) {
    throw new Error("The PRIVATE_KEY in your .env is not valid");
  }

  return `0x${privateToAddress(privateKeyHex).toString("hex")}`;
};

export const getPublicKeyFromPrivateKey = (
  privateKey: string | undefined = PRIVATE_KEY
): string => {
  if (!privateKey) {
    throw new Error("You have to provide a PRIVATE_KEY in your .env");
  }

  const privateKeyHex = Buffer.from(privateKey.toString(), "hex");

  if (!isValidPrivate(privateKeyHex)) {
    throw new Error("The PRIVATE_KEY in your .env is not valid");
  }

  const publicKeyByte = secp256k1.publicKeyCreate(privateKeyHex);
  const buf1 = Buffer.from([10]);
  const buf2 = Buffer.from([publicKeyByte.length]);
  const buf3 = Buffer.from(publicKeyByte);

  return Buffer.concat([buf1, buf2, buf3]).toString("hex");
};

export const getCosmosPublicKeyFromPrivateKey = (
  privateKey: string | undefined = PRIVATE_KEY
): { type: string; key: string } => {
  if (!privateKey) {
    throw new Error("You have to provide a PRIVATE_KEY in your .env");
  }

  const privateKeyHex = Buffer.from(privateKey.toString(), "hex");

  if (!isValidPrivate(privateKeyHex)) {
    throw new Error("The PRIVATE_KEY in your .env is not valid");
  }

  const publicKey = getPublicKeyFromPrivateKey();

  return {
    type: "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
    key: publicKey,
  };
};

export const validateInjectiveAddress = (injectiveAddress: string): boolean => {
  const address = getAddressFromInjectiveAddress(injectiveAddress);

  try {
    return validateAddress(address);
  } catch (e: any) {
    throw new Error(`Your Injective address ${injectiveAddress} is not valid`);
  }
};
