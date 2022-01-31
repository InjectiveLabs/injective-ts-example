import { fetchBalance, fetchBalances } from "../consumers/bank";
import { fetchDelegations } from "../consumers/staking";
import {
  getAddressFromPrivateKey,
  getInjectiveAddress,
} from "../utils/address";

(async () => {
  const address = getAddressFromPrivateKey();
  const injectiveAddress = getInjectiveAddress(address);

  try {
    /**
     *  Get Injective Address Balances
     **/
    const balances = await fetchBalances(injectiveAddress);
    console.log(
      balances.map((balance) => ({
        amount: balance.getAmount(),
        denom: balance.getDenom(),
      }))
    );
  } catch (e: any) {
    console.log(e);
    process.exit();
  }

  try {
    /**
     * Get Injective Address INJ balance
     **/
    const balance = await fetchBalance({ injectiveAddress, denom: "inj" });
    console.log({
      amount: balance.getAmount(),
      denom: balance.getDenom(),
    });
  } catch (e: any) {
    console.log(e);
    process.exit();
  }

  try {
    /**
     * Get Injective Address Delegations
     **/
    const delegationResponses = await fetchDelegations(injectiveAddress);

    if (delegationResponses.length === 0) {
      console.log(`${injectiveAddress} doesnt have delegations yet`);
    } else {
      console.log(
        delegationResponses.map((delegationResponse) => {
          const delegation = delegationResponse.getDelegation();
          return {
            delegation: {
              shares: delegation?.getShares(),
              delegatorAddress: delegation?.getDelegatorAddress(),
              validatorAddress: delegation?.getDelegatorAddress(),
            },
            balance: delegationResponse.getBalance(),
          };
        })
      );
    }
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
})();
