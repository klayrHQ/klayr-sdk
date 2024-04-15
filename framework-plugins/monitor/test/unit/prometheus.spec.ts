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
 */

import { when } from 'jest-when';
import { Request } from 'express';
import { testing } from 'klayr-sdk';
import { PeerInfo, SharedState } from '../../src/types';
import { prometheusExport, blocks, transactions } from '../../src/controllers';

describe('networkStats', () => {
	const blocksMock = jest.fn();
	const transactionsMock = jest.fn();
	const {
		mocks: { channelMock },
	} = testing;
	let channelInvokeMock;

	(blocks.getBlockStats as any) = blocksMock;
	(transactions.getTransactionStats as any) = transactionsMock;

	const connectedPeers: Partial<PeerInfo>[] = [
		{
			ipAddress: '127.0.0.1',
			port: 5001,
			options: { height: 102 },
		},
		{
			ipAddress: '127.0.0.1',
			port: 5002,
			options: { height: 102 },
		},
		{
			ipAddress: '127.0.0.1',
			port: 5003,
			options: { height: 101 },
		},
	];

	const disconnectedPeers: Partial<PeerInfo>[] = [
		{
			ipAddress: '127.0.0.1',
			port: 5004,
			options: { height: 2 },
		},
		{
			ipAddress: '127.0.0.1',
			port: 5005,
			options: { height: 34 },
		},
		{
			ipAddress: '127.0.0.1',
			port: 5006,
			options: { height: 51 },
		},
	];

	const nodeInfo = {
		finalizedHeight: 80,
		height: 102,
		unconfirmedTransactions: 17,
	};

	const blockStats = {
		connectedPeer: connectedPeers.length,
		blocks: {},
		averageReceivedBlocks: 6,
	};

	const transactionStats = {
		connectedPeer: connectedPeers.length,
		transactions: {},
		averageReceivedTransactions: 9,
	};

	const sharedState: SharedState = {
		blocks: {},
		transactions: {},
		forks: {
			blockHeaders: {},
			forkEventCount: 3,
		},
	};

	const prometheus = prometheusExport.getData(channelMock as any, sharedState);

	const expectedExportData =
		'# HELP klayr_avg_times_blocks_received_info Average number of times blocks received\n' +
		'# TYPE klayr_avg_times_blocks_received_info gauge\n' +
		`klayr_avg_times_blocks_received_info ${blockStats.averageReceivedBlocks}\n\n` +
		'# HELP klayr_avg_times_transactions_received_info Average number of times transactions received\n' +
		'# TYPE klayr_avg_times_transactions_received_info gauge\n' +
		`klayr_avg_times_transactions_received_info ${transactionStats.averageReceivedTransactions}\n\n` +
		'# HELP klayr_node_height_total Node Height\n' +
		'# TYPE klayr_node_height_total gauge\n' +
		`klayr_node_height_total ${nodeInfo.height}\n\n` +
		'# HELP klayr_finalized_height_total Finalized Height\n' +
		'# TYPE klayr_finalized_height_total gauge\n' +
		`klayr_finalized_height_total ${nodeInfo.finalizedHeight}\n\n` +
		'# HELP klayr_unconfirmed_transactions_total Unconfirmed transactions\n' +
		'# TYPE klayr_unconfirmed_transactions_total gauge\n' +
		`klayr_unconfirmed_transactions_total ${nodeInfo.unconfirmedTransactions}\n\n` +
		'# HELP klayr_peers_total Total number of peers\n' +
		'# TYPE klayr_peers_total gauge\n' +
		`klayr_peers_total{state="connected"} ${connectedPeers.length}\n` +
		`klayr_peers_total{state="disconnected"} ${disconnectedPeers.length}\n\n` +
		'# HELP klayr_fork_events_total Fork events\n' +
		'# TYPE klayr_fork_events_total gauge\n' +
		`klayr_fork_events_total ${sharedState.forks.forkEventCount}\n\n`;

	beforeEach(() => {
		blocksMock.mockResolvedValue(blockStats);
		transactionsMock.mockResolvedValue(transactionStats);

		channelInvokeMock = jest.fn();
		channelMock.invoke = channelInvokeMock;

		when(channelInvokeMock)
			.calledWith('network_getConnectedPeers')
			.mockResolvedValue(connectedPeers)
			.calledWith('network_getDisconnectedPeers')
			.mockResolvedValue(disconnectedPeers)
			.calledWith('system_getNodeInfo')
			.mockResolvedValue(nodeInfo);
	});

	it('should return node metrics in prometheus format', async () => {
		// Arrange
		const next = jest.fn();

		const res = {
			set: jest.fn(),
			status: jest.fn().mockImplementation(_code => res),
			send: jest.fn().mockImplementation(_param => res),
		} as any;

		// Act
		await prometheus({} as Request, res, next);

		// Assert
		expect(res.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(expectedExportData);
	});

	it('should throw error when any channel action fails', async () => {
		// Arrange
		const next = jest.fn();
		const res = {
			set: jest.fn(),
			status: jest.fn().mockImplementation(_code => res),
			send: jest.fn().mockImplementation(_param => res),
		} as any;

		const error = new Error('Something went wrong');
		(channelMock.invoke as any).mockRejectedValue(error);

		// Act
		await prometheus({} as Request, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(error);
	});
});
