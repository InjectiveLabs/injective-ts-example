import { BigNumberInBase, BigNumberInWei } from "@injectivelabs/utils";
import { transferBatch } from "./composers/bank";
import { getAddressFromPrivateKey, getInjectiveAddress } from "./utils/address";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const userWithRewards = require("./json/user-rewards.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs").promises;

(async () => {
  const batch = 10;
  let amounts = [];
  let denoms = [];
  let destinations = [];
  const address = getAddressFromPrivateKey();
  const injectiveAddress = getInjectiveAddress(address);

  for (let i = 0; i < userWithRewards.length; i++) {
    const user = userWithRewards[i];

    if (user.distributed === true) {
      continue;
    }

    const amount = new BigNumberInBase(
      new BigNumberInBase(user.total).toFixed(4, BigNumberInBase.ROUND_UP)
    );

    const amountInWei = new BigNumberInWei(
      amount.toWei().toFixed(0, BigNumberInBase.ROUND_UP)
    );
    amounts.push(amountInWei.toFixed());
    destinations.push(user.injectiveAddress);
    denoms.push("inj");
    userWithRewards[i].distributed = true;

    if ((i % batch === 0 && i > 0) || i === userWithRewards.length - 1) {
      try {
        const txHash = await transferBatch({
          address,
          injectiveAddress,
          denoms,
          destinations,
          amounts,
        });

        await fs.writeFile(
          "./src/json/user-rewards.json",
          JSON.stringify(userWithRewards, null, 1)
        );

        console.log(`Sent ${i + 1}/${userWithRewards.length} transfers.`);
        console.log(`Transaction hash: ${txHash}`);

        amounts = [];
        denoms = [];
        destinations = [];
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    }
  }
})();
