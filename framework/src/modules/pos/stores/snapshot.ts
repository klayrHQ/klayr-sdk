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

export interface SnapshotStoreData {
	validatorWeightSnapshot: {
		address: Buffer;
		weight: bigint;
	}[];
}

export const snapshotStoreSchema = {
	$id: '/pos/store/snapshot',
	type: 'object',
	required: ['validatorWeightSnapshot'],
	properties: {
		validatorWeightSnapshot: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['address', 'weight'],
				properties: {
					address: {
						dataType: 'bytes',
						fieldNumber: 1,
						format: 'klayr32',
					},
					weight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
	},
};

export class SnapshotStore extends BaseStore<SnapshotStoreData> {
	public schema = snapshotStoreSchema;
}
