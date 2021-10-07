import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { PeggyProtoComposer } from "@injectivelabs/chain-consumer";
import { BigNumber } from "@injectivelabs/utils";
import {
  getRawTx,
  simulateTransaction,
  TxProvider,
} from "../providers/TxProvider";
import { AccountDetails } from "../types";
import { getHashFromRawTx } from "../utils/tx";

export const withdraw = async ({
  denom,
  amount,
  bridgeFee,
  accountDetails,
  destinationAddress,
}: {
  amount: string;
  denom: string;
  bridgeFee: string;
  destinationAddress: string;
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = PeggyProtoComposer.withdraw({
    denom,
    amount: new BigNumber(amount).minus(bridgeFee).toFixed(),
    bridgeFeeAmount: bridgeFee,
    bridgeFeeDenom: denom,
    address: destinationAddress,
    injectiveAddress: accountDetails.address,
  });

  /**
   * Calculate Transaction hash
   */
  const rawTx = await getRawTx({ accountDetails, message });
  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  /**
   * Simulate execution of the Transaction
   */
  const response = await simulateTransaction({
    accountDetails,
    message,
  });
  console.log(
    `Transaction simulation response: ${JSON.stringify(response.gasInfo)}`
  );

  /**
   * Broadcast the transaction on chain, done in three steps:
   * 1. Prepare the transaction,
   * 2. Sign the transaction,
   * 3. Broadcast the transaction
   */
  const txResponse = await new TxProvider({
    accountDetails,
    message,
  }).broadcast();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};
