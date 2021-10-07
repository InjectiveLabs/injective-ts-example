import { AccountDetails } from "../types";

export const incrementAccountSequenceNumber = (
  accountDetails: AccountDetails
): AccountDetails => {
  return {
    ...accountDetails,
    sequence: accountDetails.sequence + 1,
  };
};
