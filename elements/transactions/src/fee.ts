/*
 * Copyright © 2020 Lisk Foundation
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

import { getBytes } from './sign';

/** Available options for {@link computeMinFee} */
export interface Options {
	/** Minimum fee per byte. Default value: {@link DEFAULT_MIN_FEE_PER_BYTE} */
	readonly minFeePerByte?: number;
	/** Number of signatures included in the transaction. Default value: {@link DEFAULT_NUMBER_OF_SIGNATURES} */
	readonly numberOfSignatures?: number;
	/** Number of empty signatures in the transaction. Default value: {@link DEFAULT_SIGNATURE_BYTE_SIZE} */
	readonly numberOfEmptySignatures?: number;
	/** Additional fee to be considered out side of minFeePerByte. ex) account initialization fee for token module */
	readonly additionalFee?: bigint;
}

/** Default value for `minFeePerByte`. */
export const DEFAULT_MIN_FEE_PER_BYTE = 1000;
/** Default value for `numberOfSignatures`. */
export const DEFAULT_NUMBER_OF_SIGNATURES = 1;
/** Default byte size for transaction signatures. */
export const DEFAULT_SIGNATURE_BYTE_SIZE = 64;

/**
 * Computes the minimum fee for a provided transaction.
 *
 *  @example
 *  ```ts
 *  import { computeMinFee } from '@klayr/transactions';
 *  const minFee = computeMinFee(TransferTrx, transferParamsSchema, options);
 *  ```
 *
 * @param trx the {@link baseTransactionSchema | transaction}  object
 * @param assetSchema Schema for the command parameters.
 * The specific schemas for parameters are described in the [Modules reference](https://klayr.xyz/documentation/klayr-sdk/modules/index.html).
 * @param options
 *
 * @returns Minimum fee for the provided transaction.
 *
 * @see [LIP 0013 - Replace static fee system by dynamic fee system](https://github.com/Klayrhq/lips/blob/main/proposals/lip-0013.md)
 * @see [LIP 0048 - Introduce Fee Module](https://github.com/Klayrhq/lips/blob/main/proposals/lip-0048.md#minimum-fee-per-transaction)
 * */
export const computeMinFee = (
	trx: Record<string, unknown>,
	assetSchema?: object,
	options?: Options,
): bigint => {
	const mockSignatures = new Array(
		options?.numberOfSignatures ?? DEFAULT_NUMBER_OF_SIGNATURES,
	).fill(Buffer.alloc(DEFAULT_SIGNATURE_BYTE_SIZE));
	if (options?.numberOfEmptySignatures) {
		mockSignatures.push(
			...new Array<Buffer>(options.numberOfEmptySignatures).fill(Buffer.alloc(0)),
		);
	}

	const { ...transaction } = trx;
	transaction.signatures = mockSignatures;
	transaction.fee = BigInt(0);

	const additionalFee = options?.additionalFee ?? BigInt(0);

	let minFee = additionalFee;

	do {
		transaction.fee = minFee;
		const transactionSize = getBytes(transaction, assetSchema).length;
		minFee =
			BigInt(transactionSize * (options?.minFeePerByte ?? DEFAULT_MIN_FEE_PER_BYTE)) +
			additionalFee;
	} while (minFee > BigInt(transaction.fee as bigint));

	return minFee;
};
