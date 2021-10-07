import { BigNumberInBase } from "@injectivelabs/utils";
import { transfer } from "./services/bank";
import { delegate } from "./services/staking";
import { fetchInjectiveAddressDetails } from "./consumers/auth";
import { fetchValidators } from "./consumers/staking";
import {
  getAddressFromPrivateKey,
  getCosmosPublicKeyFromPrivateKey,
  getInjectiveAddress,
} from "./utils/address";
import { incrementAccountSequenceNumber } from "./utils/account";

(async () => {
  const address = getAddressFromPrivateKey();
  const injectiveAddress = getInjectiveAddress(address);
  const cosmosPublicKey = getCosmosPublicKeyFromPrivateKey();
  const accountDetails = await fetchInjectiveAddressDetails(injectiveAddress);
  let accountDetailsWithCosmosPublicKey = {
    ...accountDetails,
    pubKey: cosmosPublicKey,
  };

  try {
    /**
     * Transferring Balance to another Injective Address
     **/
    const amount = new BigNumberInBase(10);
    const amountInWei = amount.toWei(
      18 // Token Decimals, in case of INJ its 18, in case od USDT its 6)
    );
    const destination = "inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne";
    const denom = "inj";
    await transfer({
      accountDetails: accountDetailsWithCosmosPublicKey,
      denom,
      destination,
      amount: amountInWei.toFixed(),
    });

    console.log(
      `Successfully transferred ${amount.toFixed()} ${denom} to ${destination} `
    );
  } catch (e: any) {
    console.log(e);
    process.exit();
  }

  /**
   * We need to increase the sequence number fot the next transaction
   * We can also fetch the sequence number from the chain again to make
   * sure the sequence number is entirely up to date
   */
  accountDetailsWithCosmosPublicKey = incrementAccountSequenceNumber(
    accountDetailsWithCosmosPublicKey
  );

  try {
    /**
     * Delegating to a Validator
     **/
    const validators = await fetchValidators();
    const amount = new BigNumberInBase(10);
    const amountInWei = amount.toWei(
      18 // Token Decimals, in case of INJ its 18, in case od USDT its 6)
    );
    const [validator] = validators; // Delegating to the first validator
    await delegate({
      accountDetails: accountDetailsWithCosmosPublicKey,
      validatorAddress: validator.getOperatorAddress(),
      amount: amountInWei.toFixed(),
    });

    console.log(
      `Successfully delegated ${amount.toFixed()} INJ to ${validator
        .getDescription()
        ?.getMoniker()} `
    );
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
