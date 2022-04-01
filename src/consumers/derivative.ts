import {
  DerivativeMarketConsumer,
  DerivativeTransformer,
  DerivativeMarket,
} from "@injectivelabs/derivatives-consumer";
import { EXCHANGE_API_URL } from "../config";

/**
 * You can use this function to get pre-defined endpoints based on the NETWORK you set
 * in the .env
 * const endpoints = getUrlEndpointForNetwork(NETWORK);
 * const SENTRY_URL = endpoints.sentryGrpcApi;
 * const EXCHANGE_API_URL = endpoints.exchangeApi;
 *
 * The exchangeApi endpoint is used to fetch data from the indexer API.
 * the sentryGrpcApi endpoint is used to fetch data from the node directly.
 */
const derivativeConsumer = new DerivativeMarketConsumer(EXCHANGE_API_URL);

export const fetchDerivativeMarkets = async (): Promise<DerivativeMarket[]> => {
  try {
    const markets = await derivativeConsumer.fetchMarkets();

    return DerivativeTransformer.grpcMarketsToMarkets(markets);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
