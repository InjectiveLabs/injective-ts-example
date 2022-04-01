import {
  DerivativeMarketConsumer,
  DerivativeTransformer,
  DerivativeMarket,
} from "@injectivelabs/derivatives-consumer";
import { SENTRY_URL } from "../config";

const derivativeConsumer = new DerivativeMarketConsumer(SENTRY_URL);

export const fetchDerivativeMarkets = async (): Promise<DerivativeMarket[]> => {
  try {
    const markets = await derivativeConsumer.fetchMarkets();

    return DerivativeTransformer.grpcMarketsToMarkets(markets);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
