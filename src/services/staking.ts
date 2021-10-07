import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { StakingProtoComposer } from "@injectivelabs/chain-consumer";
import {
  getRawTx,
  simulateTransaction,
  TxProvider,
} from "../providers/TxProvider";
import { AccountDetails } from "../types";
import { getHashFromRawTx } from "../utils/tx";

export const delegate = async ({
  accountDetails,
  validatorAddress,
  amount,
}: {
  amount: string;
  accountDetails: AccountDetails;
  validatorAddress: string;
}): Promise<TxResponse.AsObject> => {
  const message = StakingProtoComposer.delegate({
    validatorAddress,
    injectiveAddress: accountDetails.address,
    denom: "inj",
    amount,
  });

  /**
   * Calculate Transaction hash
   */
  const rawTx = await getRawTx({ accountDetails, message });
  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  /**
   * Simulate execution of the Transaction
   */
  const response = await simulateTransaction({
    accountDetails,
    message,
  });
  console.log(
    `Transaction simulation response: ${JSON.stringify(response.gasInfo)}`
  );

  /**
   * Broadcast the transaction on chain, done in three steps:
   * 1. Prepare the transaction,
   * 2. Sign the transaction,
   * 3. Broadcast the transaction
   */
  const txResponse = await new TxProvider({
    accountDetails,
    message,
  }).broadcastTransaction();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};

export const reDelegate = async ({
  accountDetails,
  destinationValidatorAddress,
  sourceValidatorAddress,
  amount,
  denom,
}: {
  amount: string;
  denom: string;
  accountDetails: AccountDetails;
  destinationValidatorAddress: string;
  sourceValidatorAddress: string;
}): Promise<TxResponse.AsObject> => {
  const message = StakingProtoComposer.reDelegate({
    amount,
    denom,
    destinationValidatorAddress,
    sourceValidatorAddress,
    injectiveAddress: accountDetails.address,
  });

  /**
   * Calculate Transaction hash
   */
  const rawTx = await getRawTx({ accountDetails, message });
  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  /**
   * Simulate execution of the Transaction
   */
  const response = await simulateTransaction({
    accountDetails,
    message,
  });
  console.log(
    `Transaction simulation response: ${JSON.stringify(response.gasInfo)}`
  );

  /**
   * Broadcast the transaction on chain, done in three steps:
   * 1. Prepare the transaction,
   * 2. Sign the transaction,
   * 3. Broadcast the transaction
   */
  const txResponse = await new TxProvider({
    accountDetails,
    message,
  }).broadcastTransaction();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};

export const unbond = async ({
  accountDetails,
  validatorAddress,
  amount,
}: {
  amount: string;
  accountDetails: AccountDetails;
  validatorAddress: string;
}): Promise<TxResponse.AsObject> => {
  const message = StakingProtoComposer.unbond({
    validatorAddress,
    denom: "inj",
    injectiveAddress: accountDetails.address,
    amount,
  });

  /**
   * Calculate Transaction hash
   */
  const rawTx = await getRawTx({ accountDetails, message });
  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  /**
   * Simulate execution of the Transaction
   */
  const response = await simulateTransaction({
    accountDetails,
    message,
  });
  console.log(
    `Transaction simulation response: ${JSON.stringify(response.gasInfo)}`
  );

  /**
   * Broadcast the transaction on chain, done in three steps:
   * 1. Prepare the transaction,
   * 2. Sign the transaction,
   * 3. Broadcast the transaction
   */
  const txResponse = await new TxProvider({
    accountDetails,
    message,
  }).broadcastTransaction();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};
