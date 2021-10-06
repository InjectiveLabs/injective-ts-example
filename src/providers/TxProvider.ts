import { GrpcException } from "@injectivelabs/exceptions";
import { SENTRY_URL } from "../config";
import {
  buildAuthInfo,
  buildRawTx,
  buildSignDoc,
  buildTxBody,
} from "../utils/tx";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { ServiceClient } from "@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb_service";
import {
  BroadcastTxRequest,
  BroadcastMode,
} from "@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb";
import { AccountDetails } from "../types";
import { TxResponse } from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import {
  AuthInfo,
  SignDoc,
  TxBody,
  TxRaw,
} from "@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb";
import { Any } from "@injectivelabs/chain-api/google/protobuf/any_pb";

export class TxProvider {
  static async getRawTx({
    authInfo,
    txBody,
    signature,
  }: {
    authInfo: AuthInfo;
    txBody: TxBody;
    signature: string | Uint8Array;
  }): Promise<TxRaw> {
    try {
      return buildRawTx({
        signature,
        txBody,
        authInfo,
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async prepare({
    accountDetails,
    message,
  }: {
    accountDetails: AccountDetails;
    message: { message: any; type: string };
  }): Promise<{ txBody: TxBody; authInfo: AuthInfo; signDoc: SignDoc }> {
    try {
      const packedMessage = new Any();
      packedMessage.setTypeUrl(message.type);
      packedMessage.setValue(message.message.serializeBinary());

      const txBody = buildTxBody(packedMessage);
      const authInfo = buildAuthInfo(accountDetails);
      const signDoc = buildSignDoc({ txBody, authInfo, accountDetails });

      return { txBody, authInfo, signDoc };
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async broadcastTransaction(
    rawTx: TxRaw
  ): Promise<TxResponse.AsObject> {
    const txService = new ServiceClient(SENTRY_URL, {
      transport: NodeHttpTransport(),
    });

    const broadcastTxRequest = new BroadcastTxRequest();
    broadcastTxRequest.setTxBytes(rawTx.serializeBinary());
    broadcastTxRequest.setMode(BroadcastMode.BROADCAST_MODE_BLOCK);

    try {
      return new Promise((resolve, reject) => {
        return txService.broadcastTx(broadcastTxRequest, (error, response) => {
          if (error || !response) {
            return reject(error);
          }

          const txResponse = response.getTxResponse();

          return resolve(
            (txResponse ? txResponse.toObject() : {}) as TxResponse.AsObject
          );
        });
      });
    } catch (e: any) {
      throw new GrpcException(e.message);
    }
  }
}
