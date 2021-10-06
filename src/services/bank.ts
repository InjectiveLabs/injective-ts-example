import { BankProtoComposer } from "@injectivelabs/chain-consumer";
import { TxProvider } from "../providers/TxProvider";
import { getHashFromRawTx, signTransaction } from "../utils/tx";
import { AccountDetails } from "../types";
import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";

export const transfer = async ({
  denom,
  amount,
  accountDetails,
  destination,
}: {
  amount: string;
  denom: string;
  destination: string;
  accountDetails: AccountDetails;
}): Promise<TxResponse.AsObject> => {
  const message = BankProtoComposer.send({
    denom,
    amount,
    srcInjectiveAddress: accountDetails.address,
    dstInjectiveAddress: destination,
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
