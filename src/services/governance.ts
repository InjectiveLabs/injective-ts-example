import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { GovernanceProtoComposer } from "@injectivelabs/chain-consumer";
import {
  getRawTx,
  simulateTransaction,
  TxProvider,
} from "../providers/TxProvider";
import { AccountDetails, VoteOptionNumber } from "../types";
import { getHashFromRawTx } from "../utils/tx";

export const voteToProposal = async ({
  vote,
  accountDetails,
  proposalId,
}: {
  vote: VoteOptionNumber;
  accountDetails: AccountDetails;
  proposalId: number;
}): Promise<TxResponse.AsObject> => {
  const message = GovernanceProtoComposer.vote({
    proposalId,
    vote,
    voter: accountDetails.address,
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
