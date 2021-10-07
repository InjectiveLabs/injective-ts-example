import { GrpcException } from "@injectivelabs/exceptions";
import { SENTRY_URL } from "../config";
import {
  buildAuthInfo,
  buildRawTx,
  buildSignDoc,
  buildTxBody,
  signTransaction,
} from "../utils/tx";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { ServiceClient } from "@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb_service";
import {
  BroadcastTxRequest,
  BroadcastMode,
  SimulateRequest,
} from "@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb";
import { AccountDetails } from "../types";
import {
  GasInfo,
  Result,
  SimulationResponse,
  TxResponse,
} from "@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb";
import {
  AuthInfo,
  SignDoc,
  TxBody,
  TxRaw,
} from "@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb";
import { Any } from "@injectivelabs/chain-api/google/protobuf/any_pb";

export class TxProvider {
  private accountDetails: AccountDetails;
  private message: {
    message: any;
    type: string;
  };

  constructor({
    accountDetails,
    message,
  }: {
    accountDetails: AccountDetails;
    message: { message: any; type: string };
  }) {
    this.accountDetails = accountDetails;
    this.message = message;
  }

  async prepare(): Promise<{
    txBody: TxBody;
    authInfo: AuthInfo;
    signDoc: SignDoc;
  }> {
    const { accountDetails, message } = this;

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

  async broadcastTransaction(): Promise<TxResponse.AsObject> {
    const { txBody, authInfo, signDoc } = await this.prepare();
    const signature = await signTransaction(signDoc);
    const rawTx = buildRawTx({
      txBody,
      authInfo,
      signature,
    });

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

export const getRawTx = async ({
  accountDetails,
  message,
}: {
  accountDetails: AccountDetails;
  message: { message: any; type: string };
}): Promise<TxRaw> => {
  try {
    const txProvider = new TxProvider({ accountDetails, message });
    const { txBody, authInfo, signDoc } = await txProvider.prepare();
    const signature = await signTransaction(signDoc);

    return buildRawTx({
      signature,
      txBody,
      authInfo,
    });
  } catch (e: any) {
    throw new GrpcException(e.message);
  }
};

export const simulateTransaction = async ({
  accountDetails,
  message,
}: {
  accountDetails: AccountDetails;
  message: { message: any; type: string };
}): Promise<SimulationResponse.AsObject> => {
  const rawTx = await getRawTx({
    accountDetails,
    message,
  });

  const txService = new ServiceClient(SENTRY_URL, {
    transport: NodeHttpTransport(),
  });
  const simulateRequest = new SimulateRequest();
  simulateRequest.setTxBytes(rawTx.serializeBinary());

  try {
    return new Promise((resolve, reject) => {
      return txService.simulate(simulateRequest, (error, response) => {
        if (error || !response) {
          return reject(error);
        }

        const result = response.getResult();
        const gasInfo = response.getGasInfo();

        return resolve({
          result: result ? result.toObject() : ({} as Result.AsObject),
          gasInfo: gasInfo ? gasInfo.toObject() : ({} as GasInfo.AsObject),
        });
      });
    });
  } catch (e: any) {
    throw new GrpcException(e.message);
  }
};
