import { fetchDerivativeMarkets } from "../consumers/derivative";

(async () => {
  try {
    /**
     *  Get Injective Address Balances
     **/
    const derivativeMarkets = await fetchDerivativeMarkets();
    console.log(
      derivativeMarkets.map((derivativeMarkets) => ({
        marketId: derivativeMarkets.marketId,
      }))
    );
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
