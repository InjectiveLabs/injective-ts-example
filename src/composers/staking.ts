import { StakingComposer } from "@injectivelabs/chain-consumer";
import { CHAIN_ID } from "../config";
import { TxProvider } from "../providers/TxProvider";

export const delegate = async ({
  address,
  injectiveAddress,
  validatorAddress,
  amount,
}: {
  amount: string;
  address: string;
  validatorAddress: string;
  injectiveAddress: string;
}): Promise<string> => {
  const message = StakingComposer.delegate({
    validatorAddress,
    injectiveAddress,
    denom: "inj",
    amount,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};

export const reDelegate = async ({
  address,
  injectiveAddress,
  destinationValidatorAddress,
  sourceValidatorAddress,
  amount,
  denom,
}: {
  amount: string;
  denom: string;
  address: string;
  destinationValidatorAddress: string;
  sourceValidatorAddress: string;
  injectiveAddress: string;
}): Promise<string> => {
  const message = StakingComposer.reDelegate({
    amount,
    denom,
    destinationValidatorAddress,
    sourceValidatorAddress,
    injectiveAddress,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};

export const unbond = async ({
  address,
  injectiveAddress,
  validatorAddress,
  amount,
}: {
  amount: string;
  address: string;
  validatorAddress: string;
  injectiveAddress: string;
}): Promise<string> => {
  const message = StakingComposer.unbond({
    validatorAddress,
    denom: "inj",
    injectiveAddress,
    amount,
  });

  const txProvider = new TxProvider({
    address,
    message,
    chainId: CHAIN_ID,
  });

  return await txProvider.broadcast();
};
