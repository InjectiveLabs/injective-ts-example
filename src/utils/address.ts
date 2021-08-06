import { bech32 } from "bech32";
import { Address, isValidPrivate, privateToAddress } from "ethereumjs-util";
import { PRIVATE_KEY } from "../config";

export const getInjectiveAddress = (address: string): string => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer();

  return bech32.encode("inj", bech32.toWords(addressBuffer));
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
