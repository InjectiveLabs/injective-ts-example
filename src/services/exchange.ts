import {
  getRawTx,
  simulateTransaction,
  TxProvider,
} from "../providers/TxProvider";
import { getHashFromRawTx } from "../utils/tx";
import { AccountDetails } from "../types";
import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import {
  GrpcOrderTypeMap,
  SpotMarketProtoComposer,
} from "@injectivelabs/spot-consumer";
import { DerivativeMarketProtoComposer } from "@injectivelabs/derivatives-consumer";
import { SubaccountProtoComposer } from "@injectivelabs/subaccount-consumer";

export const createSpotLimitOrder = async ({
  subaccountId,
  injectiveAddress,
  marketId,
  accountDetails,
  order,
}: {
  subaccountId: string;
  injectiveAddress: string;
  marketId: string;
  order: {
    orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap];
    price: string;
    quantity: string;
    feeRecipient: string;
  };
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = SpotMarketProtoComposer.createLimitOrder({
    subaccountId,
    injectiveAddress,
    marketId,
    order: {
      orderType: order.orderType,
      price: order.price,
      quantity: order.quantity,
      feeRecipient: order.feeRecipient,
      triggerPrice: "0",
    },
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
  }).broadcast();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};

export const createDerivativeLimitOrder = async ({
  subaccountId,
  injectiveAddress,
  marketId,
  accountDetails,
  order,
}: {
  subaccountId: string;
  injectiveAddress: string;
  marketId: string;
  order: {
    orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap];
    price: string;
    margin: string;
    quantity: string;
    feeRecipient: string;
  };
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = DerivativeMarketProtoComposer.createLimitOrder({
    subaccountId,
    injectiveAddress,
    marketId,
    order: {
      orderType: order.orderType,
      price: order.price,
      margin: order.margin,
      quantity: order.quantity,
      feeRecipient: order.feeRecipient,
      triggerPrice: "0",
    },
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
  }).broadcast();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};

export const depositToSubaccount = async ({
  subaccountId,
  injectiveAddress,
  denom,
  accountDetails,
  amount,
}: {
  subaccountId: string;
  injectiveAddress: string;
  denom: string;
  amount: string;
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = SubaccountProtoComposer.deposit({
    subaccountId,
    injectiveAddress,
    denom,
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
  }).broadcast();

  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );

  return txResponse;
};
