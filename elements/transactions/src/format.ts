/*
 * Copyright © 2019 Lisk Foundation
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
 *
 */
import { MAX_UINT64 } from '@klayr/validator';

const FIXED_POINT = 10 ** 8;
const KLAYR_MAX_DECIMAL_POINTS = 8;
const getDecimalPlaces = (amount: string): number =>
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	(amount.split('.')[1] || '').length;

/**
 * Converts a given amount of Beddows to KLY.
 * 1 KLY = 10^8 Beddows.
 *
 *  @example
 *  ```ts
 *  import { convertBeddowsToKLY } from '@klayr/transactions';
 *  const klyAmount = convertBeddowsToKLY("150000000");
 *  ```
 *
 * @param beddowsAmount Amount in Beddows
 *
 * @returns Amount in KLY
 *
 * */
export const convertBeddowsToKLY = (beddowsAmount?: string): string => {
	if (typeof beddowsAmount !== 'string') {
		throw new Error('Cannot convert non-string amount');
	}
	if (getDecimalPlaces(beddowsAmount)) {
		throw new Error('Beddows amount should not have decimal points');
	}
	const beddowsAmountBigInt = BigInt(beddowsAmount);
	if (beddowsAmountBigInt > MAX_UINT64) {
		throw new Error('Beddows amount out of range');
	}
	const int = (beddowsAmountBigInt / BigInt(FIXED_POINT)).toString();
	const floating = Number(beddowsAmountBigInt % BigInt(FIXED_POINT)) / FIXED_POINT;
	const floatingPointsSplit = floating
		.toLocaleString('en-US', {
			maximumFractionDigits: KLAYR_MAX_DECIMAL_POINTS,
		})
		.split('.')[1];
	const res = floating !== 0 ? `${int}.${floatingPointsSplit}` : int;

	return res;
};

/**
 * Converts a given amount of Beddows to KLY.
 * 1 KLY = 10^8 Beddows.
 *
 *  @example
 *  ```ts
 *  import { convertKLYToBeddows } from '@klayr/transactions';
 *  const klyAmount = convertKLYToBeddows("15");
 *  ```
 *
 * @param klyAmount Amount in KLY
 *
 * @returns Amount in Beddows
 * */
export const convertKLYToBeddows = (klyAmount?: string): string => {
	if (typeof klyAmount !== 'string') {
		throw new Error('Cannot convert non-string amount');
	}
	if (getDecimalPlaces(klyAmount) > KLAYR_MAX_DECIMAL_POINTS) {
		throw new Error('KLY amount has too many decimal points');
	}
	const splitAmount = klyAmount.split('.');
	const klayrAmountInt = BigInt(splitAmount[0]);
	const klayrAmountFloatBigInt = BigInt(
		(splitAmount[1] ?? '0').padEnd(KLAYR_MAX_DECIMAL_POINTS, '0'),
	);
	const beddowsAmountBigInt = klayrAmountInt * BigInt(FIXED_POINT) + klayrAmountFloatBigInt;
	if (beddowsAmountBigInt > MAX_UINT64) {
		throw new Error('KLY amount out of range');
	}

	return beddowsAmountBigInt.toString();
};
