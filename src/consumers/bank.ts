import { BankConsumer, GrpcCoin } from "@injectivelabs/chain-consumer";
import { ExchangeException } from "@injectivelabs/exceptions";
import { SENTRY_URL } from "../config";

const bankConsumer = new BankConsumer(SENTRY_URL);

export const fetchBalance = async ({
  injectiveAddress,
  denom = "inj",
}: {
  injectiveAddress: string;
  denom: string;
}): Promise<GrpcCoin> => {
  try {
    const balance = await bankConsumer.fetchBalance({
      accountAddress: injectiveAddress,
      denom,
    });

    if (!balance) {
      throw new ExchangeException(
        `Balance for ${injectiveAddress} and denom ${denom} not found`
      );
    }

    return balance;
  } catch (e: any) {
    throw new ExchangeException(e.message);
  }
};

export const fetchBalances = async (
  injectiveAddress: string
): Promise<GrpcCoin[]> => {
  try {
    return await bankConsumer.fetchBalances({
      accountAddress: injectiveAddress,
    });
  } catch (e: any) {
    throw new ExchangeException(e.message);
  }
};
