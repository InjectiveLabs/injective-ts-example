import {
  BigNumber,
  derivativePriceToChainPriceToFixed,
  derivativeMarginToChainMarginToFixed,
  derivativeQuantityToChainQuantityToFixed,
} from "@injectivelabs/utils";
import { fetchInjectiveAddressDetails } from "../consumers/auth";
import {
  getAddressFromPrivateKey,
  getCosmosPublicKeyFromPrivateKey,
  getInjectiveAddress,
} from "../utils/address";
import { createDerivativeLimitOrder } from "../services/exchange";

(async () => {
  const address = getAddressFromPrivateKey();
  const injectiveAddress = getInjectiveAddress(address);
  const cosmosPublicKey = getCosmosPublicKeyFromPrivateKey();
  const accountDetails = await fetchInjectiveAddressDetails(injectiveAddress);
  const accountDetailsWithCosmosPublicKey = {
    ...accountDetails,
    pubKey: cosmosPublicKey,
  };

  try {
    const price = 5;
    const quantity = 10;
    const leverage = 1;
    const quoteDecimals = 6; /* USDT has 6 decimals */

    const margin = new BigNumber(price).times(quantity).div(leverage);
    const marketId =
      "0x9b9980167ecc3645ff1a5517886652d94a0825e54a77d2057cbbe3ebee015963"; // INJ/USDT PERP on testnet;
    const injectiveAddress = "inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne";
    const subaccountId =
      "0x07dfdf8c15cd738d0d85830127646fb6b2e4cadd000000000000000000000000";
    const orderType = 1; /* Buy, 2 for Sale */

    await createDerivativeLimitOrder({
      accountDetails: accountDetailsWithCosmosPublicKey,
      injectiveAddress,
      subaccountId,
      marketId,
      order: {
        orderType,
        margin: derivativeMarginToChainMarginToFixed({
          value: margin,
          quoteDecimals,
        }),
        price: derivativePriceToChainPriceToFixed({
          value: price,
          quoteDecimals,
        }),
        quantity: derivativeQuantityToChainQuantityToFixed({ value: quantity }),
        feeRecipient: injectiveAddress,
      },
    });

    console.log(
      `Successfully created a derivative limit order for ${marketId}`
    );
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
