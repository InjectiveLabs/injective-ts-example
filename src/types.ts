export enum VoteOptionNumber {
  VOTE_OPTION_UNSPECIFIED = 0,
  VOTE_OPTION_YES = 1,
  VOTE_OPTION_ABSTAIN = 2,
  VOTE_OPTION_NO = 3,
  VOTE_OPTION_NO_WITH_VETO = 4,
}

export interface AccountDetails {
  address: string;
  pubKey: {
    type: string;
    key: string;
  };
  accountNumber: number;
  sequence: number;
}
