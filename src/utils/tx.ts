import {
  BigNumber,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  DEFAULT_TIMEOUT_HEIGHT,
} from "@injectivelabs/utils";
import { AccountDetails } from "../types";
import { Any } from "@injectivelabs/chain-api/google/protobuf/any_pb";
import { Coin } from "@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb";
import { INJECTIVE_CHAIN_ID, PRIVATE_KEY } from "../config";
import {
  TxBody,
  ModeInfo,
  Fee,
  SignerInfo,
  AuthInfo,
  SignDoc,
  TxRaw,
} from "@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb";
import { SignMode } from "@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb";
import crypto from "crypto";
import secp256k1 from "secp256k1";
import keccak256 from "keccak256";

export const buildTxBody = (message: any) => {
  const txBody = new TxBody();
  txBody.setMessagesList([message]);
  txBody.setMemo("");
  txBody.setTimeoutHeight(DEFAULT_TIMEOUT_HEIGHT);

  return txBody;
};

export const buildAuthInfo = (accountDetails: AccountDetails) => {
  const feeAmount = new Coin();
  feeAmount.setAmount(
    new BigNumber(DEFAULT_GAS_LIMIT).times(DEFAULT_GAS_PRICE).toString()
  );
  feeAmount.setDenom("inj");

  let fee = new Fee();
  fee.setGasLimit(DEFAULT_GAS_LIMIT);
  fee.setAmountList([feeAmount]);

  const packedPublicKey = new Any();
  packedPublicKey.setTypeUrl(accountDetails.pubKey.type);
  packedPublicKey.setValue(accountDetails.pubKey.key);

  const modeSingleDirect = new ModeInfo.Single();
  modeSingleDirect.setMode(SignMode.SIGN_MODE_DIRECT);

  const modeInfo = new ModeInfo();
  modeInfo.setSingle(modeSingleDirect);

  const signerInfo = new SignerInfo();
  signerInfo.setPublicKey(packedPublicKey);
  signerInfo.setModeInfo(modeInfo);
  signerInfo.setSequence(accountDetails.sequence);

  const authInfo = new AuthInfo();
  authInfo.setSignerInfosList([signerInfo]);
  authInfo.setFee(fee);

  return authInfo;
};

export const buildSignDoc = ({
  accountDetails,
  txBody,
  authInfo,
}: {
  accountDetails: AccountDetails;
  txBody: TxBody;
  authInfo: AuthInfo;
}) => {
  const signDoc = new SignDoc();
  signDoc.setBodyBytes(txBody.serializeBinary());
  signDoc.setAuthInfoBytes(authInfo.serializeBinary());
  signDoc.setChainId(INJECTIVE_CHAIN_ID);
  signDoc.setAccountNumber(accountDetails.accountNumber);

  return signDoc;
};

export const buildRawTx = ({
  txBody,
  authInfo,
  signature,
}: {
  txBody: TxBody;
  authInfo: AuthInfo;
  signature: string | Uint8Array;
}) => {
  const txRaw = new TxRaw();
  txRaw.setBodyBytes(txBody.serializeBinary());
  txRaw.setAuthInfoBytes(authInfo.serializeBinary());
  txRaw.setSignaturesList([signature]);

  return txRaw;
};

export const getHashFromRawTx = (rawTx: TxRaw) => {
  return crypto
    .createHash("sha256")
    .update(rawTx.serializeBinary())
    .digest("hex");
};

export const signTransaction = async (signDoc: SignDoc) => {
  if (!PRIVATE_KEY) {
    throw new Error(
      "Please provide a private key or set the PRIVATE_KEY in your .env"
    );
  }

  const msgHash = keccak256(Buffer.from(signDoc.serializeBinary()));
  const privateKeyToHex = Buffer.from(PRIVATE_KEY as string, "hex");
  const { signature } = secp256k1.ecdsaSign(msgHash, privateKeyToHex);

  return await Promise.resolve(signature);
};
