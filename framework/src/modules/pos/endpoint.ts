/*
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

import { address as cryptoAddress } from '@klayr/cryptography';
import { codec } from '@klayr/codec';
import { NotFoundError } from '@liskhq/lisk-db';
import { validator } from '@klayr/validator';
import { dataStructures, math } from '@klayr/utils';
import { ModuleEndpointContext } from '../../types';
import { BaseEndpoint } from '../base_endpoint';
import {
	punishmentPeriod,
	ValidatorAccountEndpoint,
	ValidatorAccountJSON,
	ValidatorStore,
	validatorStoreSchema,
} from './stores/validator';
import { StakerStore, stakerStoreSchema } from './stores/staker';
import {
	GetClaimableRewardsRequest,
	ClaimableReward,
	GetPoSTokenIDResponse,
	GetLockedRewardRequest,
	GetLockedRewardResponse,
	GetUnlockHeightResponse,
	GetValidatorsByStakeRequest,
	ModuleConfig,
	TokenMethod,
	StakerData,
	StakerDataJSON,
	GetExpectedSharedRewardsRequest,
	PunishmentLockingPeriods,
	GetConstantsResponse,
} from './types';
import { getPunishTime, getWaitTime, isCertificateGenerated, calculateStakeRewards } from './utils';
import { GenesisDataStore } from './stores/genesis';
import { COMMISSION, EMPTY_KEY } from './constants';
import { EligibleValidator, EligibleValidatorsStore } from './stores/eligible_validators';
import {
	getClaimableRewardsRequestSchema,
	getExpectedSharedRewardsRequestSchema,
	getLockedRewardRequestSchema,
	getLockedStakedAmountRequestSchema,
	getValidatorsByStakeRequestSchema,
} from './schemas';
import { InternalMethod } from './internal_method';

const { q96 } = math;

export class PoSEndpoint extends BaseEndpoint {
	private _moduleConfig!: ModuleConfig;
	private _moduleName!: string;
	private _tokenMethod!: TokenMethod;
	private _internalMethod!: InternalMethod;
	private _punishmentLockingPeriods!: PunishmentLockingPeriods;

	public init(
		moduleName: string,
		moduleConfig: ModuleConfig,
		internalMethod: InternalMethod,
		tokenMethod: TokenMethod,
		punishmentLockingPeriods: PunishmentLockingPeriods,
	) {
		this._moduleName = moduleName;
		this._moduleConfig = moduleConfig;
		this._tokenMethod = tokenMethod;
		this._internalMethod = internalMethod;
		this._punishmentLockingPeriods = punishmentLockingPeriods;
	}

	public async getStaker(ctx: ModuleEndpointContext): Promise<StakerDataJSON> {
		const stakerSubStore = this.stores.get(StakerStore);
		const { address } = ctx.params;
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptoAddress.validateKlayr32Address(address);
		const stakerData = await stakerSubStore.get(
			ctx,
			cryptoAddress.getAddressFromKlayr32Address(address),
		);

		return codec.toJSON(stakerStoreSchema, stakerData);
	}

	public async getValidator(ctx: ModuleEndpointContext): Promise<ValidatorAccountEndpoint> {
		const validatorSubStore = this.stores.get(ValidatorStore);
		const { address } = ctx.params;
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptoAddress.validateKlayr32Address(address);

		const validatorAccount = await validatorSubStore.get(
			ctx,
			cryptoAddress.getAddressFromKlayr32Address(address),
		);

		return {
			...codec.toJSON<ValidatorAccountJSON>(validatorStoreSchema, validatorAccount),
			address,
			punishmentPeriods: this._calculatePunishmentPeriods(
				validatorAccount.reportMisbehaviorHeights,
			),
		};
	}

	public async getAllValidators(
		ctx: ModuleEndpointContext,
	): Promise<{ validators: ValidatorAccountEndpoint[] }> {
		const validatorSubStore = this.stores.get(ValidatorStore);
		const startBuf = Buffer.alloc(20);
		const endBuf = Buffer.alloc(20, 255);
		const storeData = await validatorSubStore.iterate(ctx, { gte: startBuf, lte: endBuf });

		const response = [];
		for (const data of storeData) {
			const validatorAccount = await validatorSubStore.get(ctx, data.key);
			const validatorAccountJSON = {
				...codec.toJSON<ValidatorAccountJSON>(validatorStoreSchema, validatorAccount),
				address: cryptoAddress.getKlayr32AddressFromAddress(data.key),
				punishmentPeriods: this._calculatePunishmentPeriods(
					validatorAccount.reportMisbehaviorHeights,
				),
			};
			response.push(validatorAccountJSON);
		}

		return { validators: response };
	}

	public async getLockedStakedAmount(ctx: ModuleEndpointContext): Promise<{ amount: string }> {
		const { params } = ctx;
		validator.validate<{ address: string }>(getLockedStakedAmountRequestSchema, params);

		const amount = await this._internalMethod.getLockedStakedAmount(
			ctx,
			cryptoAddress.getAddressFromKlayr32Address(params.address),
		);
		return {
			amount: amount.toString(),
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getConstants(): Promise<GetConstantsResponse> {
		return {
			factorSelfStakes: this._moduleConfig.factorSelfStakes,
			maxLengthName: this._moduleConfig.maxLengthName,
			maxNumberSentStakes: this._moduleConfig.maxNumberSentStakes,
			maxNumberPendingUnlocks: this._moduleConfig.maxNumberPendingUnlocks,
			failSafeMissedBlocks: this._moduleConfig.failSafeMissedBlocks,
			failSafeInactiveWindow: this._moduleConfig.failSafeInactiveWindow,
			punishmentWindowStaking: this._moduleConfig.punishmentWindowStaking,
			punishmentWindowSelfStaking: this._moduleConfig.punishmentWindowSelfStaking,
			roundLength: this._moduleConfig.roundLength,
			minWeightStandby: this._moduleConfig.minWeightStandby.toString(),
			numberActiveValidators: this._moduleConfig.numberActiveValidators,
			numberStandbyValidators: this._moduleConfig.numberStandbyValidators,
			posTokenID: this._moduleConfig.posTokenID.toString('hex'),
			validatorRegistrationFee: this._moduleConfig.validatorRegistrationFee.toString(),
			maxBFTWeightCap: this._moduleConfig.maxBFTWeightCap,
			commissionIncreasePeriod: this._moduleConfig.commissionIncreasePeriod,
			maxCommissionIncreaseRate: this._moduleConfig.maxCommissionIncreaseRate,
			useInvalidBLSKey: this._moduleConfig.useInvalidBLSKey,
			baseStakeAmount: this._moduleConfig.baseStakeAmount.toString(),
			lockingPeriodStaking: this._moduleConfig.lockingPeriodStaking,
			lockingPeriodSelfStaking: this._moduleConfig.lockingPeriodSelfStaking,
			reportMisbehaviorReward: this._moduleConfig.reportMisbehaviorReward.toString(),
			reportMisbehaviorLimitBanned: this._moduleConfig.reportMisbehaviorLimitBanned,
			weightScaleFactor: this._moduleConfig.weightScaleFactor.toString(),
			defaultCommission: COMMISSION,
		};
	}

	public async getPendingUnlocks(ctx: ModuleEndpointContext): Promise<GetUnlockHeightResponse> {
		const { address } = ctx.params;
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptoAddress.validateKlayr32Address(address);
		const addressBytes = cryptoAddress.getAddressFromKlayr32Address(address);
		const stakerSubStore = this.stores.get(StakerStore);
		let stakerData: StakerData;
		try {
			stakerData = await stakerSubStore.get(ctx, addressBytes);
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
			// If staker does not exist, nothing is pending
			return {
				pendingUnlocks: [],
			};
		}

		const genesisDataStore = this.stores.get(GenesisDataStore);
		const { height: genesisHeight } = await genesisDataStore.get(ctx, EMPTY_KEY);

		const result = [];

		for (const unlock of stakerData.pendingUnlocks) {
			const expectedUnlockableHeight = await this._getExpectedUnlockHeight(
				ctx,
				addressBytes,
				unlock.validatorAddress,
				unlock.unstakeHeight,
			);
			const isCertified = isCertificateGenerated({
				maxHeightCertified: ctx.header.aggregateCommit.height,
				roundLength: this._moduleConfig.roundLength,
				unlockObject: unlock,
				genesisHeight,
			});
			result.push({
				...unlock,
				unlockable: ctx.header.height > expectedUnlockableHeight && isCertified,
				amount: unlock.amount.toString(),
				validatorAddress: cryptoAddress.getKlayr32AddressFromAddress(unlock.validatorAddress),
				expectedUnlockableHeight,
			});
		}

		return {
			pendingUnlocks: result,
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getPoSTokenID(_ctx: ModuleEndpointContext): Promise<GetPoSTokenIDResponse> {
		return {
			tokenID: this._moduleConfig.posTokenID.toString('hex'),
		};
	}

	public async getValidatorsByStake(
		ctx: ModuleEndpointContext,
	): Promise<{ validators: ValidatorAccountEndpoint[] }> {
		validator.validate<GetValidatorsByStakeRequest>(getValidatorsByStakeRequestSchema, ctx.params);
		const limit = ctx.params.limit ?? 100;

		const eligibleValidatorStore = this.stores.get(EligibleValidatorsStore);
		const validatorSubStore = this.stores.get(ValidatorStore);
		const response = [];
		let validatorsList: {
			key: Buffer;
			value: EligibleValidator;
		}[];

		if (limit < -1) {
			throw new Error(`Input parameter limit ${limit} is not valid.`);
		}
		if (limit === -1) {
			validatorsList = await eligibleValidatorStore.getAll(ctx);
		} else {
			validatorsList = await eligibleValidatorStore.getTop(ctx, limit);
		}

		for (const { key } of validatorsList) {
			const [address] = eligibleValidatorStore.splitKey(key);
			const validatorAccount = await validatorSubStore.get(ctx, address);
			const validatorAccountJSON = {
				...codec.toJSON<ValidatorAccountJSON>(validatorStoreSchema, validatorAccount),
				address: cryptoAddress.getKlayr32AddressFromAddress(address),
				punishmentPeriods: this._calculatePunishmentPeriods(
					validatorAccount.reportMisbehaviorHeights,
				),
			};
			response.push(validatorAccountJSON);
		}

		return { validators: response };
	}

	public async getLockedReward(ctx: ModuleEndpointContext): Promise<GetLockedRewardResponse> {
		validator.validate<GetLockedRewardRequest>(getLockedRewardRequestSchema, ctx.params);

		const tokenID = Buffer.from(ctx.params.tokenID, 'hex');
		const address = cryptoAddress.getAddressFromKlayr32Address(ctx.params.address);
		let locked = await this._tokenMethod.getLockedAmount(
			ctx.getImmutableMethodContext(),
			address,
			tokenID,
			this._moduleName,
		);
		if (!tokenID.equals(this._moduleConfig.posTokenID)) {
			return {
				reward: locked.toString(),
			};
		}
		// if the token is the same as governance tokenID, subtract the locked amount for stake
		const lockedAmountForStakes = await this._internalMethod.getLockedStakedAmount(ctx, address);
		locked -= lockedAmountForStakes;

		return {
			reward: locked.toString(),
		};
	}

	public async getClaimableRewards(
		context: ModuleEndpointContext,
	): Promise<{ rewards: ClaimableReward[] }> {
		validator.validate<GetClaimableRewardsRequest>(
			getClaimableRewardsRequestSchema,
			context.params,
		);

		const rewards = new dataStructures.BufferMap<bigint>();
		const address = cryptoAddress.getAddressFromKlayr32Address(context.params.address);
		const { stakes } = await this.stores.get(StakerStore).getOrDefault(context, address);

		for (const stake of stakes) {
			if (stake.validatorAddress.equals(address)) {
				continue;
			}
			const validatorAccount = await this.stores
				.get(ValidatorStore)
				.get(context, stake.validatorAddress);

			for (const validatorSharingCoefficient of validatorAccount.sharingCoefficients) {
				const stakeSharingCoefficient = stake.sharingCoefficients.find(sc =>
					sc.tokenID.equals(validatorSharingCoefficient.tokenID),
				) ?? {
					tokenID: validatorSharingCoefficient.tokenID,
					coefficient: q96(BigInt(0)).toBuffer(),
				};
				const reward = calculateStakeRewards(
					stakeSharingCoefficient,
					stake.amount,
					validatorSharingCoefficient,
				);
				const currentReward = rewards.get(validatorSharingCoefficient.tokenID) ?? BigInt(0);
				rewards.set(validatorSharingCoefficient.tokenID, reward + currentReward);
			}
		}

		return {
			rewards: rewards.entries().map(([tokenID, reward]) => ({
				tokenID: tokenID.toString('hex'),
				reward: reward.toString(),
			})),
		};
	}

	public getRegistrationFee(): { fee: string } {
		return {
			fee: this._moduleConfig.validatorRegistrationFee.toString(),
		};
	}

	public async getExpectedSharedRewards(ctx: ModuleEndpointContext): Promise<{ reward: string }> {
		validator.validate<GetExpectedSharedRewardsRequest>(
			getExpectedSharedRewardsRequestSchema,
			ctx.params,
		);
		const validatorReward = q96(BigInt(ctx.params.validatorReward));
		const validatorAccount = await this.stores
			.get(ValidatorStore)
			.get(ctx, cryptoAddress.getAddressFromKlayr32Address(ctx.params.validatorAddress));
		const commission = q96(validatorAccount.commission).div(q96(BigInt(10000)));
		const rewardFraction = q96(BigInt(1)).sub(commission);
		const totalStake = q96(BigInt(validatorAccount.totalStake) + BigInt(ctx.params.stake));

		const rewardPerUnitStaked = validatorReward.muldiv(rewardFraction, totalStake);
		const reward = rewardPerUnitStaked.mul(q96(BigInt(ctx.params.stake)));

		return {
			reward: reward.floor().toString(),
		};
	}

	private async _getExpectedUnlockHeight(
		ctx: ModuleEndpointContext,
		callerAddress: Buffer,
		validatorAddress: Buffer,
		unstakeHeight: number,
	): Promise<number> {
		const validatorSubStore = this.stores.get(ValidatorStore);
		const validatorAccount = await validatorSubStore.get(ctx, validatorAddress);
		const waitTime =
			getWaitTime(callerAddress, validatorAddress, this._punishmentLockingPeriods) + unstakeHeight;
		if (!validatorAccount.reportMisbehaviorHeights.length) {
			return waitTime;
		}
		const lastPomHeight =
			validatorAccount.reportMisbehaviorHeights[
				validatorAccount.reportMisbehaviorHeights.length - 1
			];
		// if last pom height is greater than unstake height + wait time, the validator is not punished
		if (lastPomHeight >= unstakeHeight + waitTime) {
			return waitTime;
		}
		return Math.max(
			getPunishTime(callerAddress, validatorAddress, this._punishmentLockingPeriods) +
				lastPomHeight,
			waitTime,
		);
	}

	private _calculatePunishmentPeriods(
		pomHeights: number[],
		period = this._punishmentLockingPeriods.punishmentWindowSelfStaking,
	) {
		const result: punishmentPeriod[] = [];

		for (const pomHeight of pomHeights) {
			result.push({
				start: pomHeight,
				end: pomHeight + period,
			});
		}

		return result;
	}
}
