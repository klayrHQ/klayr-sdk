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

import { Database, NotFoundError } from '@liskhq/lisk-db';
import { codec } from '@klayr/codec';
import { validator } from '@klayr/validator';
import { Logger } from '../../logger';
import { Network } from '../network';
import { BaseNetworkEndpoint } from '../network/base_network_endpoint';
import { NETWORK_LEGACY_GET_BLOCKS_FROM_ID } from '../consensus/constants';
import { getBlocksFromIdResponseSchema } from '../consensus/schema';
import { Storage } from './storage';
import { decodeBlock } from './codec';
import { getLegacyBlocksFromIdRequestSchema } from './schemas';
import { RPCLegacyBlocksByIdData } from './types';

const LEGACY_BLOCKS_FROM_IDS_RATE_LIMIT_FREQUENCY = 100;

export interface EndpointArgs {
	logger: Logger;
	network: Network;
	db: Database;
}

export class LegacyNetworkEndpoint extends BaseNetworkEndpoint {
	public readonly _storage: Storage;
	private readonly _logger: Logger;
	private readonly _network: Network;

	public constructor(args: EndpointArgs) {
		super(args.network);
		this._logger = args.logger;
		this._network = args.network;
		this._storage = new Storage(args.db);
	}

	// return 100 blocks desc starting from the id
	// eslint-disable-next-line @typescript-eslint/require-await
	public async handleRPCGetLegacyBlocksFromID(data: unknown, peerId: string): Promise<Buffer> {
		this.addRateLimit(
			NETWORK_LEGACY_GET_BLOCKS_FROM_ID,
			peerId,
			LEGACY_BLOCKS_FROM_IDS_RATE_LIMIT_FREQUENCY,
		);

		let rpcBlocksByIdData: RPCLegacyBlocksByIdData;
		try {
			rpcBlocksByIdData = codec.decode<RPCLegacyBlocksByIdData>(
				getLegacyBlocksFromIdRequestSchema,
				data as never,
			);
		} catch (error) {
			this._logger.warn(
				{
					err: error as Error,
					req: data,
					peerId,
				},
				`${NETWORK_LEGACY_GET_BLOCKS_FROM_ID} response failed on decoding. Applying a penalty to the peer`,
			);
			this._network.applyPenaltyOnPeer({
				peerId,
				penalty: 100,
			});
			throw error;
		}

		try {
			validator.validate(getLegacyBlocksFromIdRequestSchema, rpcBlocksByIdData);
		} catch (error) {
			this._logger.warn(
				{
					err: error as Error,
					req: data,
					peerId,
				},
				`${NETWORK_LEGACY_GET_BLOCKS_FROM_ID} response failed on validation. Applying a penalty to the peer`,
			);
			this._network.applyPenaltyOnPeer({
				peerId,
				penalty: 100,
			});
			throw error;
		}
		const { blockID: lastBlockID, snapshotBlockID } = rpcBlocksByIdData;

		let bracketInfo;
		try {
			bracketInfo = await this._storage.getBracketInfo(snapshotBlockID);
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
			// Peer should be banned if the request is coming for invalid snapshotBlockID which does not exist
			// Peers should always choose peers with snapshotBlockID present in their nodeInfo
			this._logger.warn(
				{ peerId },
				`Received invalid snapshotBlockID: Applying a penalty to the peer`,
			);
			this._network.applyPenaltyOnPeer({ peerId, penalty: 100 });

			throw error;
		}

		let fromBlockHeight;
		try {
			// if the requested blockID is the same as snapshotBlockID then start from a block before snapshotBlock
			if (snapshotBlockID.equals(lastBlockID)) {
				fromBlockHeight = bracketInfo.snapshotBlockHeight;
			} else {
				const {
					block: {
						header: { height },
					},
				} = decodeBlock(await this._storage.getBlockByID(lastBlockID));
				fromBlockHeight = height;
			}
		} catch (errors) {
			return codec.encode(getBlocksFromIdResponseSchema, { blocks: [] });
		}

		// we have to sync backwards so if lastBlockHeight is 171, then node responds with blocks from [71, 170]
		// so lastBlockHeight = 170 and fetchFromHeight should be (lastBlockHeight - 99) = 71
		// where blocks at 71 and 170 are inclusive so in total 100 blocks
		const lastBlockHeight = fromBlockHeight - 1;
		const fetchFromHeight =
			bracketInfo.startHeight >= lastBlockHeight - 99
				? bracketInfo.startHeight
				: lastBlockHeight - 100;

		this._logger.debug(
			{ peerId, engineModule: 'legacy' },
			`Responding to "${NETWORK_LEGACY_GET_BLOCKS_FROM_ID}" with blocks from height ${fetchFromHeight} to ${lastBlockHeight}`,
		);
		const encodedBlocks = await this._storage.getBlocksByHeightBetween(
			fetchFromHeight,
			lastBlockHeight,
		);

		return codec.encode(getBlocksFromIdResponseSchema, { blocks: encodedBlocks });
	}
}
