import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { StakingProtoComposer } from "@injectivelabs/chain-consumer";
import { TxProvider } from "../providers/TxProvider";
import { AccountDetails } from "../types";
import { getHashFromRawTx, signTransaction } from "../utils/tx";

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

  const { txBody, signDoc, authInfo } = await TxProvider.prepare({
    accountDetails,
    message,
  });
  const signature = await signTransaction(signDoc);
  const rawTx = await TxProvider.getRawTx({
    txBody,
    authInfo,
    signature,
  });

  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  return await TxProvider.broadcastTransaction(rawTx);
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

  const { txBody, signDoc, authInfo } = await TxProvider.prepare({
    accountDetails,
    message,
  });
  const signature = await signTransaction(signDoc);
  const rawTx = await TxProvider.getRawTx({
    txBody,
    authInfo,
    signature,
  });

  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  return await TxProvider.broadcastTransaction(rawTx);
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

  const { txBody, signDoc, authInfo } = await TxProvider.prepare({
    accountDetails,
    message,
  });
  const signature = await signTransaction(signDoc);
  const rawTx = await TxProvider.getRawTx({
    txBody,
    authInfo,
    signature,
  });

  console.log(`Transaction Hash: ${getHashFromRawTx(rawTx)}`);

  return await TxProvider.broadcastTransaction(rawTx);
};
