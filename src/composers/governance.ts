import { GovernanceComposer } from "@injectivelabs/chain-consumer";
import { CHAIN_ID } from "../config";
import { TxProvider } from "../providers/TxProvider";
import { VoteOptionNumber } from "../types";

export const voteToProposal = async ({
  address,
  vote,
  injectiveAddress,
  proposalId,
}: {
  vote: VoteOptionNumber;
  address: string;
  injectiveAddress: string;
  proposalId: number;
}): Promise<string> => {
  const message = GovernanceComposer.vote({
    proposalId,
    vote,
    voter: injectiveAddress,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};
