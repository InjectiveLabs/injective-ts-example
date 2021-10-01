import { BigNumberInBase, BigNumberInWei } from "@injectivelabs/utils";
import { transfer } from "./composers/bank";
import { getAddressFromPrivateKey, getInjectiveAddress } from "./utils/address";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const userWithRewards = require("./json/user-rewards.json");

(async () => {
  const address = getAddressFromPrivateKey();
  const injectiveAddress = getInjectiveAddress(address);

  for (const user of userWithRewards) {
    try {
      /**
       * Transferring Balance to another Injective Address
       **/
      const amount = new BigNumberInBase(
        new BigNumberInBase(user.total).toFixed(4, BigNumberInBase.ROUND_UP)
      );
      const amountInWei = new BigNumberInWei(
        amount.toWei().toFixed(0, BigNumberInBase.ROUND_UP)
      );
      const destination = user.injectiveAddress;
      const denom = "inj";
      const txHash = await transfer({
        address,
        injectiveAddress,
        denom,
        destination,
        amount: amountInWei.toFixed(),
      });

      console.log(
        `Successfully transferred ${amount.toFixed()} ${denom} to ${destination} | TxHash: ${txHash}`
      );
    } catch (e) {
      console.log(e);
    }
  }
})();
