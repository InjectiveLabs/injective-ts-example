import { BankComposer } from "@injectivelabs/chain-consumer";
import { CHAIN_ID } from "../config";
import { TxProvider } from "../providers/TxProvider";

export const transfer = async ({
  address,
  denom,
  amount,
  injectiveAddress,
  destination,
}: {
  amount: string;
  address: string;
  denom: string;
  destination: string;
  injectiveAddress: string;
}): Promise<string> => {
  const message = BankComposer.send({
    denom,
    amount,
    srcInjectiveAddress: injectiveAddress,
    dstInjectiveAddress: destination,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};

export const transferBatch = async ({
  address,
  denoms,
  amounts,
  injectiveAddress,
  destinations,
}: {
  amounts: string[];
  address: string;
  denoms: string[];
  destinations: string[];
  injectiveAddress: string;
}): Promise<string> => {
  const message = destinations.map((destination, index) => {
    return BankComposer.send({
      denom: denoms[index],
      amount: amounts[index],
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: destination,
    });
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};
