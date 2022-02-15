import { denomAmountToChainDenomAmountToFixed } from "@injectivelabs/utils";
import { fetchInjectiveAddressDetails } from "../consumers/auth";
import {
  getAddressFromPrivateKey,
  getCosmosPublicKeyFromPrivateKey,
  getInjectiveAddress,
} from "../utils/address";
import { depositToSubaccount } from "../services/exchange";

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
    const denom = "inj";
    const amount = 10;
    const decimals = 18;
    const injectiveAddress = "inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne";
    const subaccountId =
      "0x07dfdf8c15cd738d0d85830127646fb6b2e4cadd000000000000000000000000";

    await depositToSubaccount({
      injectiveAddress,
      denom,
      subaccountId,
      amount: denomAmountToChainDenomAmountToFixed({ value: amount, decimals }),
      accountDetails: accountDetailsWithCosmosPublicKey,
    });

    console.log(`Successfully deposited to subaccount ${subaccountId}`);
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
