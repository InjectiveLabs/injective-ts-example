import {
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
} from "@injectivelabs/utils";
import { fetchInjectiveAddressDetails } from "../consumers/auth";
import {
  getAddressFromPrivateKey,
  getCosmosPublicKeyFromPrivateKey,
  getInjectiveAddress,
} from "../utils/address";
import { createSpotLimitOrder } from "../services/exchange";

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
    const baseDecimals = 18; // INJ has 18 decimals
    const quoteDecimals = 6; // USDT has 6 decimals

    const marketId =
      "0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0"; // INJ/USDT on testnet;
    const injectiveAddress = "inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne";
    const subaccountId =
      "0x07dfdf8c15cd738d0d85830127646fb6b2e4cadd000000000000000000000000";
    const orderType = 1; /* Buy, 2 for Sale */

    await createSpotLimitOrder({
      accountDetails: accountDetailsWithCosmosPublicKey,
      injectiveAddress,
      subaccountId,
      marketId,
      order: {
        orderType,
        price: spotPriceToChainPriceToFixed({
          value: price,
          baseDecimals,
          quoteDecimals,
        }),
        quantity: spotQuantityToChainQuantityToFixed({
          value: quantity,
          baseDecimals,
        }),
        feeRecipient: injectiveAddress,
      },
    });

    console.log(`Successfully created a spot limit order for ${marketId}`);
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
