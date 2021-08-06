import {
  StakingConsumer,
  GrpcValidator,
  GrpcDelegationResponse,
  DistributionConsumer,
  GrpcDelegationDelegatorReward,
  GrpcUnbondingDelegation,
  GrpcReDelegationResponse,
} from "@injectivelabs/chain-consumer";
import { SENTRY_URL } from "../config";

const stakingConsumer = new StakingConsumer(SENTRY_URL);
const distributionConsumer = new DistributionConsumer(SENTRY_URL);

export const fetchValidators = async (): Promise<GrpcValidator[]> => {
  try {
    const { validators } = await stakingConsumer.fetchValidators();

    return validators;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchDelegations = async (
  injectiveAddress: string
): Promise<GrpcDelegationResponse[]> => {
  try {
    const { delegations } = await stakingConsumer.fetchDelegations({
      injectiveAddress,
    });

    return delegations;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchUserDelegationRewards = async (
  injectiveAddress: string
): Promise<GrpcDelegationDelegatorReward[]> => {
  try {
    return await distributionConsumer.fetchDelegatorRewards(injectiveAddress);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchUserUnBondingDelegations = async (
  injectiveAddress: string
): Promise<GrpcUnbondingDelegation[]> => {
  try {
    const { unbondingDelegations } =
      await stakingConsumer.fetchUnbondingDelegations({
        injectiveAddress,
      });

    return unbondingDelegations;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchUserReDelegations = async (
  injectiveAddress: string
): Promise<GrpcReDelegationResponse[]> => {
  try {
    const { redelegations } = await stakingConsumer.fetchReDelegations({
      injectiveAddress,
    });

    return redelegations;
  } catch (e) {
    throw new Error(e.message);
  }
};
