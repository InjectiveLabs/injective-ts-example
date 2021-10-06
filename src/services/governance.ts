import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { GovernanceProtoComposer } from "@injectivelabs/chain-consumer";
import { TxProvider } from "../providers/TxProvider";
import { AccountDetails, VoteOptionNumber } from "../types";
import { getHashFromRawTx, signTransaction } from "../utils/tx";

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

  const { txBody, signDoc, authInfo } = await TxProvider.prepare({
    accountDetails,
    message,
  });
  const signature = await signTransaction(signDoc);
  const rawTx = await TxProvider.getRawTx({
    txBody,
    authInfo,
    signature,
  });

  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  return await TxProvider.broadcastTransaction(rawTx);
};
