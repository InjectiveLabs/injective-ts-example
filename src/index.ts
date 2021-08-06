import { BigNumberInBase } from "@injectivelabs/utils";
import { transfer } from "./composers/bank";
import { delegate } from "./composers/staking";
import { fetchBalance, fetchBalances } from "./consumers/bank";
import { fetchDelegations, fetchValidators } from "./consumers/staking";
import { getAddressFromPrivateKey, getInjectiveAddress } from "./utils/address";

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
  } catch (e) {
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
  } catch (e) {
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
  } catch (e) {
    console.log(e);
    process.exit();
  }

  try {
    /**
     * Transferring Balance to another Injective Address
     **/
    const amount = new BigNumberInBase(10);
    const amountInWei = amount.toWei(
      18 // Token Decimals, in case of INJ its 18, in case od USDT its 6)
    );
    const destination = "inj18j838zrg00e45e053zf5ehc9u3t3rar7ak0cv3";
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
    process.exit();
  }

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
    const txHash = await delegate({
      address,
      injectiveAddress,
      validatorAddress: validator.getOperatorAddress(),
      amount: amountInWei.toFixed(),
    });

    console.log(
      `Successfully delegated ${amount.toFixed()} INJ to ${validator
        .getDescription()
        ?.getMoniker()} | TxHash: ${txHash}`
    );
  } catch (e) {
    console.log(e);
    process.exit();
  }
})();
