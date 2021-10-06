import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import { PeggyProtoComposer } from "@injectivelabs/chain-consumer";
import { BigNumber } from "@injectivelabs/utils";
import { TxProvider } from "../providers/TxProvider";
import { AccountDetails } from "../types";
import { getHashFromRawTx, signTransaction } from "../utils/tx";

export const withdraw = async ({
  denom,
  amount,
  bridgeFee,
  accountDetails,
  destinationAddress,
}: {
  amount: string;
  denom: string;
  bridgeFee: string;
  destinationAddress: string;
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = PeggyProtoComposer.withdraw({
    denom,
    amount: new BigNumber(amount).minus(bridgeFee).toFixed(),
    bridgeFeeAmount: bridgeFee,
    bridgeFeeDenom: denom,
    address: destinationAddress,
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
