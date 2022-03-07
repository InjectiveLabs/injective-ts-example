import {
  FundingConsumer,
  DerivativeTransformer,
} from "@injectivelabs/derivatives-consumer";
import { ExchangeException } from "@injectivelabs/exceptions";
import { EXCHANGE_API_URL } from "../config";

const fundingConsumer = new FundingConsumer(EXCHANGE_API_URL);

export const fetchFundingPayments = async ({
  marketId,
  subaccountId,
}: {
  marketId?: string;
  subaccountId?: string;
}) => {
  try {
    const fundingPayments = await fundingConsumer.fetchFundingPayments({
      marketId,
      subaccountId,
    });

    return DerivativeTransformer.grpcFundingPaymentsToFundingPayments(
      fundingPayments.getPaymentsList()
    );
  } catch (e: any) {
    throw new ExchangeException(e.message);
  }
};

export const fetchFundingRates = async (marketId: string) => {
  try {
    const fundingPayments = await fundingConsumer.fetchFundingRates({
      marketId,
    });

    return DerivativeTransformer.grpcFundingRatesToFundingRates(
      fundingPayments.getFundingRatesList()
    );
  } catch (e: any) {
    throw new ExchangeException(e.message);
  }
};
