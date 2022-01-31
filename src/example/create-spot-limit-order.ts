import { BigNumberInBase } from "@injectivelabs/utils";
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
    const price = new BigNumberInBase(5).toWei(
      6 /* USDT decimals */ - 18 /* INJ decimals */
    );
    const quantity = new BigNumberInBase(10).toWei(
      18 // Token Decimals, in case of INJ its 18, in case od USDT its 6)
    );
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
        price: price.toFixed(),
        quantity: quantity.toFixed(),
        feeRecipient: injectiveAddress,
      },
    });

    console.log(`Successfully created a spot limit order for ${marketId}`);
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
