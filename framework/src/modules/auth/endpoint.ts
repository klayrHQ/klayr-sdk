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

import { validator } from '@klayr/validator';
import { address as cryptoAddress } from '@klayr/cryptography';
import { Schema } from '@klayr/codec';
import { ModuleEndpointContext } from '../../types';
import { VerifyStatus } from '../../state_machine';
import { BaseEndpoint } from '../base_endpoint';
import {
	AuthAccountJSON,
	VerifyEndpointResultJSON,
	KeySignaturePair,
	SortedMultisignatureGroup,
	MultiSigRegMsgTag,
} from './types';
import { getTransactionFromParameter, verifyNonce, verifySignatures } from './utils';
import { AuthAccountStore } from './stores/auth_account';
import { multisigRegMsgSchema, sortMultisignatureGroupRequestSchema } from './schemas';
import { MESSAGE_TAG_MULTISIG_REG } from './constants';

export class AuthEndpoint extends BaseEndpoint {
	public async getAuthAccount(context: ModuleEndpointContext): Promise<AuthAccountJSON> {
		const {
			params: { address },
		} = context;

		if (typeof address !== 'string') {
			throw new Error('Invalid address format.');
		}
		cryptoAddress.validateKlayr32Address(address);

		const accountAddress = cryptoAddress.getAddressFromKlayr32Address(address);
		const authAccountStore = this.stores.get(AuthAccountStore);
		const authAccount = await authAccountStore.getOrDefault(context, accountAddress);

		return {
			nonce: authAccount.nonce.toString(),
			numberOfSignatures: authAccount.numberOfSignatures,
			mandatoryKeys: authAccount.mandatoryKeys.map(key => key.toString('hex')),
			optionalKeys: authAccount.optionalKeys.map(key => key.toString('hex')),
		};
	}

	/**
	 * Validates signatures of the provided transaction, including transactions from multisignature accounts.
	 *
	 * https://github.com/Klayrhq/lips/blob/main/proposals/lip-0041.md#isvalidsignature
	 */
	public async isValidSignature(context: ModuleEndpointContext): Promise<VerifyEndpointResultJSON> {
		const {
			params: { transaction: transactionParameter },
			chainID,
		} = context;

		const transaction = getTransactionFromParameter(transactionParameter);
		const accountAddress = cryptoAddress.getAddressFromPublicKey(transaction.senderPublicKey);
		const authAccountStore = this.stores.get(AuthAccountStore);
		const account = await authAccountStore.getOrDefault(context, accountAddress);

		try {
			verifySignatures(transaction, chainID, account);
		} catch (error) {
			return { verified: false };
		}

		return { verified: true };
	}

	public async isValidNonce(context: ModuleEndpointContext): Promise<VerifyEndpointResultJSON> {
		const {
			params: { transaction: transactionParameter },
		} = context;

		const transaction = getTransactionFromParameter(transactionParameter);
		const accountAddress = cryptoAddress.getAddressFromPublicKey(transaction.senderPublicKey);

		const authAccountStore = this.stores.get(AuthAccountStore);
		const account = await authAccountStore.getOrDefault(context, accountAddress);

		const verificationResult = verifyNonce(transaction, account).status;
		return { verified: verificationResult === VerifyStatus.OK };
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getMultiSigRegMsgSchema(
		_context: ModuleEndpointContext,
	): Promise<{ schema: Schema }> {
		return { schema: multisigRegMsgSchema };
	}

	public sortMultisignatureGroup(context: ModuleEndpointContext): SortedMultisignatureGroup {
		validator.validate(sortMultisignatureGroupRequestSchema, context.params);

		const mandatory = context.params.mandatory as KeySignaturePair[];
		const optional = context.params.optional as KeySignaturePair[];

		const compareStrings = (a: string, b: string) => (a < b ? -1 : 1);

		const sortedMandatory = mandatory
			.slice()
			.sort((keySignaturePairA, keySignaturePairB) =>
				compareStrings(keySignaturePairA.publicKey, keySignaturePairB.publicKey),
			);
		const sortedOptional = optional
			.slice()
			.sort((keySignaturePairA, keySignaturePairB) =>
				compareStrings(keySignaturePairA.publicKey, keySignaturePairB.publicKey),
			);

		return {
			mandatoryKeys: sortedMandatory.map(keySignaturePair => keySignaturePair.publicKey),
			optionalKeys: sortedOptional.map(keySignaturePair => keySignaturePair.publicKey),
			signatures: sortedMandatory
				.map(keySignaturePair => keySignaturePair.signature)
				.concat(sortedOptional.map(keySignaturePair => keySignaturePair.signature)),
		};
	}

	public getMultiSigRegMsgTag(): MultiSigRegMsgTag {
		return { tag: MESSAGE_TAG_MULTISIG_REG };
	}
}
