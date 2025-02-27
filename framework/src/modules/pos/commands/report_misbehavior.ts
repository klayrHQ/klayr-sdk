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

import { BlockHeader } from '@klayr/chain';
import {
	CommandVerifyContext,
	VerificationResult,
	VerifyStatus,
	CommandExecuteContext,
} from '../../../state_machine';
import { BaseCommand } from '../../base_command';
import { MODULE_NAME_POS } from '../constants';
import { reportMisbehaviorCommandParamsSchema } from '../schemas';
import {
	PomCommandDependencies,
	PomTransactionParams,
	TokenMethod,
	TokenID,
	ValidatorsMethod,
	PunishmentLockingPeriods,
} from '../types';
import { getValidatorWeight, getPunishmentPeriod } from '../utils';
import { ValidationError } from '../../../errors';
import { areDistinctHeadersContradicting } from '../../../engine/bft/utils';
import { ValidatorStore } from '../stores/validator';
import { ValidatorPunishedEvent } from '../events/validator_punished';
import { ValidatorBannedEvent } from '../events/validator_banned';
import { EligibleValidatorsStore } from '../stores/eligible_validators';
import { StakerStore } from '../stores/staker';

export class ReportMisbehaviorCommand extends BaseCommand {
	public schema = reportMisbehaviorCommandParamsSchema;
	private _tokenMethod!: TokenMethod;
	private _validatorsMethod!: ValidatorsMethod;
	private _posTokenID!: TokenID;
	private _factorSelfStakes!: number;
	private _lockingPeriodSelfStaking!: number;
	private _reportMisbehaviorReward!: bigint;
	private _reportMisbehaviorLimitBanned!: number;
	private _punishmentLockingPeriods!: PunishmentLockingPeriods;

	public addDependencies(args: PomCommandDependencies) {
		this._tokenMethod = args.tokenMethod;
		this._validatorsMethod = args.validatorsMethod;
	}

	public init(args: {
		posTokenID: TokenID;
		factorSelfStakes: number;
		lockingPeriodSelfStaking: number;
		reportMisbehaviorReward: bigint;
		reportMisbehaviorLimitBanned: number;
		punishmentLockingPeriods: PunishmentLockingPeriods;
	}) {
		this._posTokenID = args.posTokenID;
		this._factorSelfStakes = args.factorSelfStakes;
		this._lockingPeriodSelfStaking = args.lockingPeriodSelfStaking;
		this._reportMisbehaviorReward = args.reportMisbehaviorReward;
		this._reportMisbehaviorLimitBanned = args.reportMisbehaviorLimitBanned;
		this._punishmentLockingPeriods = args.punishmentLockingPeriods;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: CommandVerifyContext<PomTransactionParams>,
	): Promise<VerificationResult> {
		const { chainID, getMethodContext, params, header } = context;

		const currentHeight = header.height;
		const header1 = BlockHeader.fromBytes(params.header1);
		const header2 = BlockHeader.fromBytes(params.header2);

		if (!header1.generatorAddress.equals(header2.generatorAddress)) {
			throw new Error('Different generator address never contradict to each other.');
		}

		const validatorAddress = header1.generatorAddress;
		const validatorSubStore = this.stores.get(ValidatorStore);
		const validatorAccount = await validatorSubStore.get(context, validatorAddress);

		const { generatorKey } = await this._validatorsMethod.getValidatorKeys(
			getMethodContext(),
			header1.generatorAddress,
		);

		header1.validateSignature(generatorKey, chainID);
		header2.validateSignature(generatorKey, chainID);

		const maxPunishableHeight = Math.max(
			Math.abs(header1.height - currentHeight),
			Math.abs(header2.height - currentHeight),
		);

		if (maxPunishableHeight >= this._lockingPeriodSelfStaking) {
			throw new Error('Locking period has expired.');
		}

		if (
			getPunishmentPeriod(
				validatorAddress,
				validatorAddress,
				validatorAccount.reportMisbehaviorHeights,
				header.height,
				this._punishmentLockingPeriods,
			) > 0
		) {
			throw new Error('Validator is already punished.');
		}

		if (validatorAccount.isBanned) {
			throw new Error('Validator is already banned.');
		}

		/* Checking if the two headers are the same or not. */
		if (header1.id.equals(header2.id) || !areDistinctHeadersContradicting(header1, header2)) {
			return {
				status: VerifyStatus.FAIL,
				error: new ValidationError(
					'BlockHeaders are not contradicting as per BFT violation rules.',
					'',
				),
			};
		}

		return {
			status: VerifyStatus.OK,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async execute(context: CommandExecuteContext<PomTransactionParams>): Promise<void> {
		const { getMethodContext, params, transaction, header } = context;
		const currentHeight = header.height;
		const header1 = BlockHeader.fromBytes(params.header1);

		const punishedAddress = header1.generatorAddress;
		const validatorSubStore = this.stores.get(ValidatorStore);
		const validatorAccount = await validatorSubStore.get(context, punishedAddress);

		validatorAccount.reportMisbehaviorHeights.push(currentHeight);
		this.events.get(ValidatorPunishedEvent).log(context, {
			address: punishedAddress,
			height: currentHeight,
		});

		if (validatorAccount.reportMisbehaviorHeights.length === this._reportMisbehaviorLimitBanned) {
			validatorAccount.isBanned = true;

			this.events.get(ValidatorBannedEvent).log(context, {
				address: punishedAddress,
				height: currentHeight,
			});
		}
		const reward =
			this._reportMisbehaviorReward > validatorAccount.selfStake
				? validatorAccount.selfStake
				: this._reportMisbehaviorReward;

		if (reward > BigInt(0)) {
			await this._tokenMethod.unlock(
				getMethodContext(),
				punishedAddress,
				MODULE_NAME_POS,
				this._posTokenID,
				reward,
			);
			await this._tokenMethod.transfer(
				getMethodContext(),
				punishedAddress,
				transaction.senderAddress,
				this._posTokenID,
				reward,
			);
		}
		const oldWeight = getValidatorWeight(
			this._factorSelfStakes,
			validatorAccount.selfStake,
			validatorAccount.totalStake,
		);
		validatorAccount.selfStake -= reward;
		validatorAccount.totalStake -= reward;
		await validatorSubStore.set(context, punishedAddress, validatorAccount);
		const eligibleValidatorStore = this.stores.get(EligibleValidatorsStore);
		await eligibleValidatorStore.update(context, punishedAddress, oldWeight, validatorAccount);
		const stakerSubStore = this.stores.get(StakerStore);
		const stakerData = await stakerSubStore.get(context, punishedAddress);
		const existingStakeIndex = stakerData.stakes.findIndex(senderStake =>
			senderStake.validatorAddress.equals(punishedAddress),
		);
		stakerData.stakes[existingStakeIndex].amount -= reward;
		await stakerSubStore.set(context, punishedAddress, stakerData);
	}
}
