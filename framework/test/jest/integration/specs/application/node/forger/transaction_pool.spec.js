/*
 * Copyright © 2018 Lisk Foundation
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

'use strict';

const {
	nodeUtils,
	storageUtils,
	configUtils,
} = require('../../../../../../utils');

describe('Delete block', () => {
	const dbName = 'delete_block';
	let storage;
	let node;

	beforeAll(async () => {
		storage = new storageUtils.StorageSandbox(
			configUtils.storageConfig({ database: dbName }),
			dbName,
		);
		await storage.bootstrap();
		node = await nodeUtils.createAndLoadNode(storage, console);
	});

	afterAll(async () => {
		await node.cleanup();
		await storage.cleanup();
	});

	describe('given a valid transaction while forging is disabled', () => {
		describe('when transaction is pass to the transaction pool', () => {
			it.todo('should be added to the transaction pool', async () => {});
			it.todo('should expire after X sec', async () => {});
		});
	});
});
