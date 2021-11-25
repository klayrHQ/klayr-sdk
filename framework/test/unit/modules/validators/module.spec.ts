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
import { StateStore } from '@liskhq/lisk-chain';
import { InMemoryKVStore } from '@liskhq/lisk-db';
import { ValidatorsModule } from '../../../../src/modules/validators';
import { EMPTY_KEY, STORE_PREFIX_GENESIS_DATA } from '../../../../src/modules/validators/constants';
import { genesisDataSchema } from '../../../../src/modules/validators/schemas';
import { GenesisData } from '../../../../src/modules/validators/types';
import { createBlockContext, createBlockHeaderWithDefaults } from '../../../../src/testing';

describe('ValidatorsModule', () => {
	let stateStore: StateStore;
	let genesisDataSubStore: StateStore;
	let validatorsModule: ValidatorsModule;
	const genesisTimestamp = 45672;

	describe('afterTransactionsExecute', () => {
		it(`should set genesis store with the correct timestamp`, async () => {
			validatorsModule = new ValidatorsModule();
			stateStore = new StateStore(new InMemoryKVStore());
			const blockHeader = createBlockHeaderWithDefaults({ timestamp: genesisTimestamp });
			const blockAfterExecuteContext = createBlockContext({
				header: blockHeader,
				stateStore,
			}).getBlockAfterExecuteContext();
			await validatorsModule.initGenesisState(blockAfterExecuteContext);

			genesisDataSubStore = stateStore.getStore(validatorsModule.id, STORE_PREFIX_GENESIS_DATA);
			const genesisData = await genesisDataSubStore.getWithSchema<GenesisData>(
				EMPTY_KEY,
				genesisDataSchema,
			);
			expect(genesisData.timestamp).toBe(genesisTimestamp);
		});
	});
});
