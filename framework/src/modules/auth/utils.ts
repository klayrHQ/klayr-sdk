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

import { Transaction, TAG_TRANSACTION } from '@klayr/chain';
import { ed } from '@klayr/cryptography';
import { isHexString } from '@klayr/validator';
import { VerificationResult, VerifyStatus } from '../../state_machine';
import { AuthAccount } from './stores/auth_account';

/**
 * Verifies that the given `signature` corresponds to given `chainID`, `publicKey` and `transactionBytes`
 *
 * https://github.com/Klayrhq/lips/blob/main/proposals/lip-0041.md#transaction-verification
 */
export const verifySignature = (
	chainID: Buffer,
	publicKey: Buffer,
	signature: Buffer,
	transactionBytes: Buffer,
	id: Buffer,
): void => {
	const isSignatureValid = ed.verifyData(
		TAG_TRANSACTION,
		chainID,
		transactionBytes,
		signature,
		publicKey,
	);

	if (!isSignatureValid) {
		throw new Error(
			`Failed to validate signature '${signature.toString(
				'hex',
			)}' for transaction with id '${id.toString('hex')}'`,
		);
	}
};

/**
 * https://github.com/Klayrhq/lips/blob/main/proposals/lip-0041.md#transaction-verification
 * Current code is already in sync with LIP. No change needed.
 */
export const verifyMultiSignatureTransaction = (
	chainID: Buffer,
	id: Buffer,
	account: AuthAccount,
	signatures: ReadonlyArray<Buffer>,
	transactionBytes: Buffer,
): void => {
	const keys = account.mandatoryKeys.concat(account.optionalKeys);
	const mandatoryKeysCount = account.mandatoryKeys.length;

	// Filter empty signature to compare against numberOfSignatures
	const nonEmptySignaturesCount = signatures.filter(k => k.length !== 0).length;

	// Check if signatures excluding empty string match required numberOfSignatures
	if (nonEmptySignaturesCount !== account.numberOfSignatures || signatures.length !== keys.length) {
		throw new Error(
			`Transaction signatures does not match required number of signatures: '${account.numberOfSignatures.toString()}' for transaction with id '${id.toString(
				'hex',
			)}'`,
		);
	}

	for (let i = 0; i < keys.length; i += 1) {
		if (signatures[i].length !== 0) {
			verifySignature(chainID, keys[i], signatures[i], transactionBytes, id);
		}
		// do not throw for missing optional signatures
		else if (signatures[i].length === 0 && i < mandatoryKeysCount) {
			throw new Error('Missing signature for a mandatory key.');
		}
	}
};

export const verifySignatures = (
	transaction: Transaction,
	chainID: Buffer,
	account: AuthAccount,
) => {
	if (account.numberOfSignatures !== 0) {
		verifyMultiSignatureTransaction(
			chainID,
			transaction.id,
			account,
			transaction.signatures,
			transaction.getSigningBytes(),
		);
	} else {
		if (transaction.signatures.length !== 1) {
			throw new Error(
				`Transactions from a single signature account should have exactly one signature. Found ${transaction.signatures.length} signatures.`,
			);
		}

		verifySignature(
			chainID,
			transaction.senderPublicKey,
			transaction.signatures[0],
			transaction.getSigningBytes(),
			transaction.id,
		);
	}
};

export const verifyNonce = (
	transaction: Transaction,
	senderAccount: AuthAccount,
): VerificationResult => {
	if (transaction.nonce < senderAccount.nonce) {
		return { status: VerifyStatus.FAIL };
	}
	return {
		status: transaction.nonce > senderAccount.nonce ? VerifyStatus.PENDING : VerifyStatus.OK,
	};
};

export const getTransactionFromParameter = (transactionParameter: unknown) => {
	if (!isHexString(transactionParameter)) {
		throw new Error('Transaction parameter must be a string.');
	}

	const transactionBuffer = Buffer.from(transactionParameter as string, 'hex');

	const transaction = Transaction.fromBytes(transactionBuffer);
	transaction.validate();

	return transaction;
};
