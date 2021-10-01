/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountAddress, ChainId } from "@injectivelabs/ts-types";
import { ExchangeException, Web3Exception } from "@injectivelabs/exceptions";
import { TransactionConsumer } from "@injectivelabs/exchange-consumer";
import { PrepareTxResponse } from "@injectivelabs/exchange-api/injective_exchange_rpc_pb";
import { EXCHANGE_URL } from "../config";
import { Web3Strategy } from "@injectivelabs/web3-strategy";
import { default as initWeb3 } from "./../web3";

const transactionConsumer = new TransactionConsumer(EXCHANGE_URL);

export class TxProvider {
  private message: any;

  private web3Strategy: Web3Strategy;

  private address: string; // Eth Wallet Address

  private chainId: ChainId;

  constructor({
    message,
    address,
    chainId,
  }: {
    message: any;
    address: AccountAddress;
    chainId: ChainId;
    gasLimit?: number;
  }) {
    this.message = message;
    this.web3Strategy = initWeb3();
    this.address = address;
    this.chainId = chainId;
  }

  async prepare(): Promise<PrepareTxResponse> {
    const { chainId, address, message } = this;

    try {
      return await transactionConsumer.prepareTxRequest({
        address,
        message,
        chainId,
      });
    } catch (e: any) {
      throw new ExchangeException(e.message);
    }
  }

  async sign(txData: string): Promise<string> {
    const { address, web3Strategy } = this;

    try {
      return await web3Strategy.signTypedDataV4(txData, address);
    } catch (e: any) {
      throw new Web3Exception(e.message);
    }
  }

  async getHash(): Promise<string> {
    // const { message, chainId } = this;
    // const txResponse = await this.prepare();
    // const signature = await this.sign(txResponse.getData());

    // TODO: Calculate txHash based on the `txResponse` and `signature`

    return Promise.resolve(""); // Remove this
  }

  async broadcast(): Promise<string> {
    const { message, chainId } = this;
    const txResponse = await this.prepare();
    const signature = await this.sign(txResponse.getData());

    try {
      const { txHash } = await transactionConsumer.broadcastTxRequest({
        message: message as any,
        signature,
        chainId,
        txResponse,
      });

      return txHash;
    } catch (e: any) {
      throw new ExchangeException(e.message);
    }
  }
}
