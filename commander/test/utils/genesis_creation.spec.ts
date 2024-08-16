/*
 * LiskHQ/klayr-commander
 * Copyright © 2023 Lisk Foundation
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

import { Application } from 'klayr-framework';
import { codec } from '@klayr/codec';
import { generateGenesisBlockDefaultPoSAssets } from '../../src/utils/genesis_creation';

describe('genesis creation', () => {
	describe('generateGenesisBlockDefaultPoSAssets', () => {
		const chainID = Buffer.from([2, 0, 0, 0]);
		it('should create processable genesis block', async () => {
			const { genesisAssets } = generateGenesisBlockDefaultPoSAssets({
				chainID: chainID.toString('hex'),
				keysList: [],
				numberOfValidators: 51,
				tokenDistribution: BigInt('100000000000000'),
			});

			const { app } = Application.defaultApplication({
				genesis: {
					chainID: chainID.toString('hex'),
				},
			});

			const genesisBlock = await app.generateGenesisBlock({
				assets: genesisAssets.map(a => ({
					module: a.module,
					data: codec.fromJSON(a.schema, a.data),
					schema: a.schema,
				})),
				chainID,
			});
			const assetsJSON = genesisBlock.assets.toJSON();
			expect(assetsJSON.map(a => a.module)).toEqual(['interoperability', 'pos', 'token']);
			expect(assetsJSON.map(a => a.data).every(d => typeof d === 'string')).toBe(true);
		});
	});
});
