import { AuthConsumer } from "@injectivelabs/chain-consumer";
import { EthAccount } from "@injectivelabs/chain-api/injective/types/v1beta1/account_pb";
import { SENTRY_URL } from "../config";
import { AccountDetails } from "../types";

const authConsumer = new AuthConsumer(SENTRY_URL);

export const fetchInjectiveAddressDetails = async (address: string) => {
  const account = await authConsumer.fetchAddressDetails(address);
  const decodedAccount = EthAccount.deserializeBinary(account.getValue());
  const baseAccount = decodedAccount.getBaseAccount();

  if (!baseAccount) {
    throw new Error(`Base account not found for ${address}`);
  }

  return baseAccount.toObject() as AccountDetails;
};
