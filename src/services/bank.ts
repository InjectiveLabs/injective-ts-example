import { BankProtoComposer } from "@injectivelabs/chain-consumer";
import {
  getRawTx,
  simulateTransaction,
  TxProvider,
} from "../providers/TxProvider";
import { getHashFromRawTx } from "../utils/tx";
import { AccountDetails } from "../types";
import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";

export const transfer = async ({
  denom,
  amount,
  accountDetails,
  destination,
}: {
  amount: string;
  denom: string;
  destination: string;
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = BankProtoComposer.send({
    denom,
    amount,
    srcInjectiveAddress: accountDetails.address,
    dstInjectiveAddress: destination,
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
  console.log(`Transaction simulation response: ${response.result}`);

  /**
   * Broadcast the transaction on chain, done in three steps:
   * 1. Prepare the transaction,
   * 2. Sign the transaction,
   * 3. Broadcast the transaction
   */
  return await new TxProvider({
    accountDetails,
    message,
  }).broadcastTransaction();
};
