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
 *
 */

import {
	BlockAssets,
	BlockHeader,
	BlockHeaderAttrs,
	StateStore,
	Transaction,
} from '@klayr/chain';
import { utils } from '@klayr/cryptography';
import { InMemoryDatabase } from '@liskhq/lisk-db';
import { codec } from '@klayr/codec';
import { ModuleEndpointContext } from '../types';
import { Logger } from '../logger';
import {
	BlockContext,
	createImmutableMethodContext,
	createMethodContext,
	EventQueue,
	GenesisBlockContext,
	ImmutableSubStore,
	InsertAssetContext,
	MethodContext,
	TransactionContext,
} from '../state_machine';
import { loggerMock } from './mocks';
import { WritableBlockAssets } from '../engine/generator/types';
import { StateStore as IStateStore, SubStore } from '../state_machine/types';
import { PrefixedStateReadWriter } from '../state_machine/prefixed_state_read_writer';
import { InMemoryPrefixedStateDB } from './in_memory_prefixed_state';
import { CCMsg, CrossChainMessageContext, RecoverContext } from '../modules/interoperability/types';
import { ccuParamsSchema } from '../modules/interoperability';

const createTestHeader = () =>
	new BlockHeader({
		height: 0,
		generatorAddress: utils.getRandomBytes(20),
		previousBlockID: Buffer.alloc(0),
		timestamp: Math.floor(Date.now() / 1000),
		version: 0,
		transactionRoot: utils.hash(Buffer.alloc(0)),
		stateRoot: utils.hash(Buffer.alloc(0)),
		maxHeightGenerated: 0,
		maxHeightPrevoted: 0,
		impliesMaxPrevotes: true,
		assetRoot: utils.hash(Buffer.alloc(0)),
		aggregateCommit: {
			height: 0,
			aggregationBits: Buffer.alloc(0),
			certificateSignature: Buffer.alloc(0),
		},
		validatorsHash: utils.hash(Buffer.alloc(0)),
	});

export type CreateGenesisBlockContextParams = {
	header?: BlockHeader;
	stateStore?: PrefixedStateReadWriter;
	eventQueue?: EventQueue;
	assets?: BlockAssets;
	logger?: Logger;
	chainID?: Buffer;
};

export const createGenesisBlockContext = (
	params: CreateGenesisBlockContextParams,
): GenesisBlockContext => {
	const logger = params.logger ?? loggerMock;
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const eventQueue = params.eventQueue ?? new EventQueue(params.header ? params.header.height : 0);
	const header = params.header ?? createTestHeader();
	return new GenesisBlockContext({
		eventQueue,
		stateStore,
		header,
		assets: params.assets ?? new BlockAssets(),
		logger,
		chainID: params.chainID ?? Buffer.from('10000000', 'hex'),
	});
};

export const createBlockContext = (params: {
	stateStore?: PrefixedStateReadWriter;
	contextStore?: Map<string, unknown>;
	eventQueue?: EventQueue;
	chainID?: Buffer;
	logger?: Logger;
	header?: BlockHeader;
	assets?: BlockAssets;
	transactions?: Transaction[];
}): BlockContext => {
	const logger = params.logger ?? loggerMock;
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const contextStore = params.contextStore ?? new Map<string, unknown>();
	const eventQueue = params.eventQueue ?? new EventQueue(params.header ? params.header.height : 0);
	const header = params.header ?? createTestHeader();
	return new BlockContext({
		stateStore,
		contextStore,
		logger,
		eventQueue,
		transactions: params.transactions ?? [],
		header,
		assets: params.assets ?? new BlockAssets(),
		chainID: params.chainID ?? utils.getRandomBytes(4),
	});
};

export const createBlockGenerateContext = (params: {
	assets?: WritableBlockAssets;
	getOffchainStore?: (moduleID: Buffer, subStorePrefix: Buffer) => SubStore;
	logger?: Logger;
	getMethodContext?: () => MethodContext;
	getStore?: (moduleID: Buffer, storePrefix: Buffer) => ImmutableSubStore;
	header: BlockHeader;
	finalizedHeight?: number;
	chainID?: Buffer;
}): InsertAssetContext => {
	const db = new InMemoryDatabase();
	const generatorStore = new StateStore(db);
	const getOffchainStore = (moduleID: Buffer, subStorePrefix: Buffer) =>
		generatorStore.getStore(moduleID, subStorePrefix);
	const header = params.header ?? createTestHeader();
	const stateStore = new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const contextStore = new Map<string, unknown>();
	const getStore = (moduleID: Buffer, storePrefix: Buffer) =>
		stateStore.getStore(moduleID, storePrefix);

	return {
		stateStore,
		contextStore,
		assets: params.assets ?? new BlockAssets([]),
		getOffchainStore: params.getOffchainStore ?? getOffchainStore,
		logger: params.logger ?? loggerMock,
		chainID: params.chainID ?? utils.getRandomBytes(32),
		getMethodContext:
			params.getMethodContext ??
			(() => ({
				getStore,
				eventQueue: new EventQueue(params.header ? params.header.height : 0),
				contextStore: new Map<string, unknown>(),
			})),
		getStore: params.getStore ?? getStore,
		getFinalizedHeight: () => params.finalizedHeight ?? 0,
		header,
	};
};

export const createTransactionContext = (params: {
	stateStore?: PrefixedStateReadWriter;
	contextStore?: Map<string, unknown>;
	eventQueue?: EventQueue;
	logger?: Logger;
	header?: BlockHeader;
	assets?: BlockAssets;
	chainID?: Buffer;
	transaction: Transaction;
}): TransactionContext => {
	const logger = params.logger ?? loggerMock;
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const contextStore = params.contextStore ?? new Map<string, unknown>();
	const eventQueue = params.eventQueue ?? new EventQueue(params.header ? params.header.height : 0);
	const header = params.header ?? createTestHeader();
	return new TransactionContext({
		stateStore,
		contextStore,
		logger,
		eventQueue,
		header,
		assets: params.assets ?? new BlockAssets(),
		chainID: params.chainID ?? utils.getRandomBytes(32),
		transaction: params.transaction,
	});
};

export const createTransientMethodContext = (params: {
	stateStore?: PrefixedStateReadWriter;
	contextStore?: Map<string, unknown>;
	eventQueue?: EventQueue;
}): MethodContext => {
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const contextStore = params.contextStore ?? new Map<string, unknown>();
	const eventQueue = params.eventQueue ?? new EventQueue(0);
	return createMethodContext({ stateStore, eventQueue, contextStore });
};

export const createTransientModuleEndpointContext = (params: {
	stateStore?: PrefixedStateReadWriter;
	moduleStore?: StateStore;
	context?: { header: BlockHeaderAttrs };
	params?: Record<string, unknown>;
	logger?: Logger;
	chainID?: Buffer;
}): ModuleEndpointContext => {
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const moduleStore = params.moduleStore ?? new StateStore(new InMemoryDatabase());
	const parameters = params.params ?? {};
	const logger = params.logger ?? loggerMock;
	const chainID = params.chainID ?? Buffer.alloc(0);
	return {
		getStore: (moduleID: Buffer, storePrefix: Buffer) => stateStore.getStore(moduleID, storePrefix),
		getOffchainStore: (moduleID: Buffer, storePrefix: Buffer) =>
			moduleStore.getStore(moduleID, storePrefix),
		getImmutableMethodContext: () => createImmutableMethodContext(stateStore),
		params: parameters,
		header: params.context?.header ?? createTestHeader(),
		logger,
		chainID,
	};
};

export const createCrossChainMessageContext = (params: {
	ccm?: CCMsg;
	feeAddress?: Buffer;
	logger?: Logger;
	chainID?: Buffer;
	header?: { timestamp: number; height: number };
	transaction?: { senderAddress: Buffer; fee: bigint; params: Buffer };
	stateStore?: IStateStore;
	contextStore?: Map<string, unknown>;
	eventQueue?: EventQueue;
	sendingChainID?: Buffer;
}): CrossChainMessageContext => {
	const stateStore =
		params.stateStore ?? new PrefixedStateReadWriter(new InMemoryPrefixedStateDB());
	const contextStore = params.contextStore ?? new Map<string, unknown>();
	const logger = params.logger ?? loggerMock;
	const chainID = params.chainID ?? Buffer.alloc(0);
	const eventQueue = params.eventQueue ?? new EventQueue(0);
	const getStore = (moduleID: Buffer, storePrefix: Buffer) =>
		stateStore.getStore(moduleID, storePrefix);
	return {
		header: params.header ?? { timestamp: 0, height: 0 },
		ccm: params.ccm ?? {
			nonce: BigInt(0),
			module: 'token',
			crossChainCommand: 'crossChainTransfer',
			sendingChainID: Buffer.from([0, 0, 0, 2]),
			receivingChainID: Buffer.from([0, 0, 0, 3]),
			fee: BigInt(20000),
			status: 0,
			params: Buffer.alloc(0),
		},
		contextStore,
		chainID,
		eventQueue,
		getMethodContext: () => createMethodContext({ eventQueue, stateStore, contextStore }),
		getStore,
		logger,
		stateStore,
		transaction: params.transaction ?? {
			senderAddress: utils.getRandomBytes(20),
			fee: BigInt(100000000),
			params: codec.encode(ccuParamsSchema, {
				activeValidatorsUpdate: {
					blsKeysUpdate: [],
					bftWeightsUpdate: [],
					bftWeightsUpdateBitmap: Buffer.alloc(0),
				},
				certificate: Buffer.alloc(1),
				certificateThreshold: BigInt(1),
				inboxUpdate: {
					crossChainMessages: [],
					messageWitnessHashes: [],
					outboxRootWitness: {
						bitmap: Buffer.alloc(1),
						siblingHashes: [],
					},
				},
				sendingChainID: params.sendingChainID ?? Buffer.from('04000001', 'hex'),
			}),
		},
	};
};

export const createBeforeRecoverCCMsgMethodContext = (params: {
	ccm: CCMsg;
	trsSender: Buffer;
	stateStore?: PrefixedStateReadWriter;
	logger?: Logger;
	chainID?: Buffer;
	getMethodContext?: () => MethodContext;
	feeAddress: Buffer;
	eventQueue?: EventQueue;
}): CrossChainMessageContext => createCrossChainMessageContext(params);

export const createRecoverCCMsgMethodContext = (params: {
	ccm?: CCMsg;
	terminatedChainID: Buffer;
	module: string;
	storePrefix: Buffer;
	storeKey: Buffer;
	storeValue: Buffer;
	stateStore?: PrefixedStateReadWriter;
	logger?: Logger;
	chainID?: Buffer;
	getMethodContext?: () => MethodContext;
	feeAddress: Buffer;
	eventQueue?: EventQueue;
}): RecoverContext => ({
	...createCrossChainMessageContext(params),
	terminatedChainID: params.terminatedChainID,
	module: params.module,
	substorePrefix: params.storePrefix,
	storeKey: params.storeKey,
	storeValue: params.storeValue,
});
