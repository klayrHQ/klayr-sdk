/*
 * Copyright © 2022 Lisk Foundation
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
import { BaseStore } from '../../base_store';
import { CHAIN_ID_LENGTH, STORE_PREFIX } from '../constants';

// https://github.com/Klayrhq/lips/blob/main/proposals/lip-0045.md#registered-names-substore
export const registeredNamesSchema = {
	$id: '/modules/interoperability/chainId',
	type: 'object',
	required: ['chainID'],
	properties: {
		chainID: {
			dataType: 'bytes',
			minLength: CHAIN_ID_LENGTH,
			maxLength: CHAIN_ID_LENGTH,
			fieldNumber: 1,
		},
	},
};

export interface ChainID {
	chainID: Buffer;
}

export class RegisteredNamesStore extends BaseStore<ChainID> {
	public schema = registeredNamesSchema;

	public get storePrefix(): Buffer {
		return STORE_PREFIX;
	}
}
