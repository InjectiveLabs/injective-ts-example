import Web3 from "web3";

const initWeb3 = (): Web3 => {
  return new Web3();
};

export const web3 = initWeb3();
export default initWeb3;
