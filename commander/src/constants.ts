/*
 * LiskHQ/klayr-commander
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
 *
 */

export enum NETWORK {
	DEFAULT = 'default',
	MAINNET = 'mainnet',
	TESTNET = 'testnet',
	BETANET = 'betanet',
	ALPHANET = 'alphanet',
	DEVNET = 'devnet',
}
export const DEFAULT_NETWORK = NETWORK.DEFAULT;
export const RELEASE_URL = 'https://downloads.klayr.xyz/klayr';
export const OWNER_READ_WRITE = 0o600;

export const plainGeneratorKeysSchema = {
	$id: '/commander/plainGeneratorKeys',
	type: 'object',
	properties: {
		generatorKey: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		generatorPrivateKey: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		blsKey: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
		blsPrivateKey: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
	},
};
