import { PeggyComposer } from "@injectivelabs/chain-consumer";
import { BigNumber } from "@injectivelabs/utils";
import { CHAIN_ID } from "../config";
import { TxProvider } from "../providers/TxProvider";

export const withdraw = async ({
  address,
  denom,
  amount,
  bridgeFee,
  injectiveAddress,
  destinationAddress,
}: {
  amount: string;
  address: string;
  denom: string;
  bridgeFee: string;
  destinationAddress: string;
  injectiveAddress: string;
}): Promise<string> => {
  const message = PeggyComposer.withdraw({
    denom,
    amount: new BigNumber(amount).minus(bridgeFee).toFixed(),
    bridgeFeeAmount: bridgeFee,
    bridgeFeeDenom: denom,
    address: destinationAddress,
    injectiveAddress,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};
