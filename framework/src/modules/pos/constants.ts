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
export const MODULE_NAME_POS = 'pos';

export const COMMAND_NAME_VALIDATOR_REGISTRATION = 'registerValidator';

export const LOCKING_PERIOD_STAKING = 25_920; // (3 * 24 * 3600 // BLOCK_TIME)
export const LOCKING_PERIOD_SELF_STAKING = 241_920; // (28 * 24 * 3600 // BLOCK_TIME)
export const PUNISHMENT_WINDOW_STAKING = 241_920; // (28 * 24 * 3600 // BLOCK_TIME)
export const PUNISHMENT_WINDOW_SELF_STAKING = 725_760; // (725,760 = 3 * PUNISHMENT_WINDOW_STAKING)
export const MAX_LENGTH_NAME = 20;
export const BASE_STAKE_AMOUNT = BigInt(10) * BigInt(10) ** BigInt(8);
export const MAX_NUMBER_SENT_STAKES = 10;
export const MAX_NUMBER_PENDING_UNLOCKS = 20;
export const VALIDATOR_REGISTRATION_FEE = BigInt(10) * BigInt(10) ** BigInt(8);
export const MAX_PUNISHABLE_BLOCK_HEIGHT_DIFFERENCE = 260_000;
export const REPORT_MISBEHAVIOR_LIMIT_BANNED = 5;
export const REPORT_MISBEHAVIOR_REWARD = BigInt(100_000_000);
export const VALIDATOR_LIST_ROUND_OFFSET = 2;
export const EMPTY_KEY = Buffer.alloc(0);
export const MAX_SNAPSHOT = 3;
export const CHAIN_ID_LENGTH = 4;
export const LOCAL_ID_LENGTH = 4;
export const TOKEN_ID_LENGTH = CHAIN_ID_LENGTH + LOCAL_ID_LENGTH;
export const MAX_NUMBER_BYTES_Q96 = 24;
export const COMMISSION = 10000;
export const COMMISSION_INCREASE_PERIOD = 241_920; // (28 * 24 * 3600 // BLOCK_TIME)
export const MAX_COMMISSION_INCREASE_RATE = 500; // MAX_COMMISSION_INCREASE in LIP-0063
export const FACTOR_SELF_STAKES = 10; // FACTOR_SELF_STAKING in LIP-0063
const FAIL_SAFE_MISSED_BLOCKS = 50;
const FAIL_SAFE_INACTIVE_WINDOW = 120_960; // (14 * 24 * 3600 // BLOCK_TIME)
const MAX_BFT_WEIGHT_CAP = 500; // 1000 in LIP-0063
const USE_INVALID_BLS_KEY = false; // true in LIP-0063
const NUMBER_ACTIVE_VALIDATORS = 51;
const NUMBER_STANDBY_VALIDATORS = 2;
const MIN_WEIGHT_STANDBY = BigInt(1000) * BigInt(10) ** BigInt(8);

// Key length
export const ED25519_PUBLIC_KEY_LENGTH = 32;
export const BLS_PUBLIC_KEY_LENGTH = 48;
export const BLS_POP_LENGTH = 96;
export const MAX_CAP = 10000;
export const MAX_COMMISSION = 10000;
export const MIN_WEIGHT = BigInt(1000) * BigInt(10) ** BigInt(8);
export const WEIGHT_SCALE_FACTOR = BigInt(1000) * BigInt(10) ** BigInt(8);

export const defaultConfig = {
	factorSelfStakes: FACTOR_SELF_STAKES,
	maxLengthName: MAX_LENGTH_NAME,
	maxNumberSentStakes: MAX_NUMBER_SENT_STAKES,
	maxNumberPendingUnlocks: MAX_NUMBER_PENDING_UNLOCKS,
	failSafeMissedBlocks: FAIL_SAFE_MISSED_BLOCKS,
	failSafeInactiveWindow: FAIL_SAFE_INACTIVE_WINDOW,
	punishmentWindowStaking: PUNISHMENT_WINDOW_STAKING,
	punishmentWindowSelfStaking: PUNISHMENT_WINDOW_SELF_STAKING,
	minWeightStandby: MIN_WEIGHT_STANDBY.toString(),
	numberActiveValidators: NUMBER_ACTIVE_VALIDATORS,
	numberStandbyValidators: NUMBER_STANDBY_VALIDATORS,
	validatorRegistrationFee: VALIDATOR_REGISTRATION_FEE.toString(),
	maxBFTWeightCap: MAX_BFT_WEIGHT_CAP,
	commissionIncreasePeriod: COMMISSION_INCREASE_PERIOD,
	maxCommissionIncreaseRate: MAX_COMMISSION_INCREASE_RATE,
	useInvalidBLSKey: USE_INVALID_BLS_KEY,
	baseStakeAmount: BASE_STAKE_AMOUNT.toString(),
	lockingPeriodStaking: LOCKING_PERIOD_STAKING,
	lockingPeriodSelfStaking: LOCKING_PERIOD_SELF_STAKING,
	reportMisbehaviorReward: REPORT_MISBEHAVIOR_REWARD.toString(),
	reportMisbehaviorLimitBanned: REPORT_MISBEHAVIOR_LIMIT_BANNED,
	weightScaleFactor: WEIGHT_SCALE_FACTOR.toString(),
};

export const enum PoSEventResult {
	STAKE_SUCCESSFUL = 0,
	STAKE_FAILED_NON_REGISTERED_VALIDATOR = 1,
	STAKE_FAILED_INVALID_UNSTAKE_PARAMETERS = 2,
	STAKE_FAILED_TOO_MANY_PENDING_UNLOCKS = 3,
	STAKE_FAILED_TOO_MANY_SENT_STAKES = 4,
}
