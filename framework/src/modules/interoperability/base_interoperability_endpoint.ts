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

import { validator } from '@klayr/validator';
import { BaseEndpoint } from '../base_endpoint';
import { BaseCCMethod } from './base_cc_method';
import {
	ChainAccountJSON,
	ChainValidatorsJSON,
	ChannelDataJSON,
	Inbox,
	InboxJSON,
	Outbox,
	OutboxJSON,
	OwnChainAccountJSON,
} from './types';
import { ModuleEndpointContext } from '../../types';
import { NamedRegistry } from '../named_registry';
import { TerminatedStateAccountJSON, TerminatedStateStore } from './stores/terminated_state';
import { TerminatedOutboxAccountJSON, TerminatedOutboxStore } from './stores/terminated_outbox';
import { chainAccountToJSON } from './utils';
import { ChainValidatorsStore } from './stores/chain_validators';
import { ChainAccountStore } from './stores/chain_account';
import { ChannelDataStore } from './stores/channel_data';
import { OwnChainAccountStore } from './stores/own_chain_account';
import { EMPTY_BYTES } from './constants';
import {
	ccmSchema,
	getChainAccountRequestSchema,
	getChainValidatorsRequestSchema,
	getChannelRequestSchema,
	getTerminatedOutboxAccountRequestSchema,
	getTerminatedStateAccountRequestSchema,
} from './schemas';

export abstract class BaseInteroperabilityEndpoint extends BaseEndpoint {
	protected readonly interoperableCCMethods = new Map<string, BaseCCMethod>();

	public constructor(protected stores: NamedRegistry, protected offchainStores: NamedRegistry) {
		super(stores, offchainStores);
	}

	public async getChainAccount(context: ModuleEndpointContext): Promise<ChainAccountJSON> {
		validator.validate(getChainAccountRequestSchema, context.params);

		const chainID = Buffer.from(context.params.chainID as string, 'hex');
		return chainAccountToJSON(await this.stores.get(ChainAccountStore).get(context, chainID));
	}

	public async getAllChainAccounts(
		context: ModuleEndpointContext,
	): Promise<{ chains: ChainAccountJSON[] }> {
		validator.validate(getChainAccountRequestSchema, context.params);
		const startChainID = Buffer.from(context.params.chainID as string, 'hex');

		const chainAccounts = (
			await this.stores.get(ChainAccountStore).getAllAccounts(context, startChainID)
		).map(chainAccount => chainAccountToJSON(chainAccount));

		return { chains: chainAccounts };
	}

	public async getChannel(context: ModuleEndpointContext): Promise<ChannelDataJSON> {
		validator.validate(getChannelRequestSchema, context.params);
		const chainID = Buffer.from(context.params.chainID as string, 'hex');
		const { inbox, messageFeeTokenID, outbox, partnerChainOutboxRoot, minReturnFeePerByte } =
			await this.stores.get(ChannelDataStore).get(context, chainID);

		const inboxJSON = this._toBoxJSON(inbox) as InboxJSON;
		const outboxJSON = this._toBoxJSON(outbox) as OutboxJSON;

		return {
			messageFeeTokenID: messageFeeTokenID.toString('hex'),
			outbox: outboxJSON,
			inbox: inboxJSON,
			partnerChainOutboxRoot: partnerChainOutboxRoot.toString('hex'),
			minReturnFeePerByte: minReturnFeePerByte.toString(),
		};
	}

	public async getOwnChainAccount(context: ModuleEndpointContext): Promise<OwnChainAccountJSON> {
		const { chainID, name, nonce } = await this.stores
			.get(OwnChainAccountStore)
			.get(context, EMPTY_BYTES);

		return {
			chainID: chainID.toString('hex'),
			name,
			nonce: nonce.toString(),
		};
	}

	public async getTerminatedStateAccount(
		context: ModuleEndpointContext,
	): Promise<TerminatedStateAccountJSON> {
		validator.validate(getTerminatedStateAccountRequestSchema, context.params);
		const chainID = Buffer.from(context.params.chainID as string, 'hex');
		const { stateRoot, initialized, mainchainStateRoot } = await this.stores
			.get(TerminatedStateStore)
			.get(context, chainID);

		return {
			stateRoot: stateRoot.toString('hex'),
			initialized,
			mainchainStateRoot: mainchainStateRoot.toString('hex'),
		};
	}

	public async getTerminatedOutboxAccount(
		context: ModuleEndpointContext,
	): Promise<TerminatedOutboxAccountJSON> {
		validator.validate(getTerminatedOutboxAccountRequestSchema, context.params);
		const chainID = Buffer.from(context.params.chainID as string, 'hex');
		const { outboxRoot, outboxSize, partnerChainInboxSize } = await this.stores
			.get(TerminatedOutboxStore)
			.get(context, chainID);

		return {
			outboxRoot: outboxRoot.toString('hex'),
			outboxSize,
			partnerChainInboxSize,
		};
	}

	public async getChainValidators(context: ModuleEndpointContext): Promise<ChainValidatorsJSON> {
		validator.validate(getChainValidatorsRequestSchema, context.params);
		const chainID = Buffer.from(context.params.chainID as string, 'hex');
		const chainAccountStore = this.stores.get(ChainAccountStore);
		const chainAccountExists = await chainAccountStore.has(context, chainID);
		if (!chainAccountExists) {
			throw new Error('Chain account does not exist.');
		}

		const chainValidatorsStore = this.stores.get(ChainValidatorsStore);

		const validators = await chainValidatorsStore.get(context, chainID);

		return {
			activeValidators: validators.activeValidators.map(v => ({
				blsKey: v.blsKey.toString('hex'),
				bftWeight: v.bftWeight.toString(),
			})),
			certificateThreshold: validators.certificateThreshold.toString(),
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getCCMSchema(
		_context: ModuleEndpointContext,
	): Promise<{ schema: Record<string, unknown> }> {
		return {
			schema: ccmSchema,
		};
	}

	private _toBoxJSON(box: Inbox | Outbox) {
		return {
			appendPath: box.appendPath.map(ap => ap.toString('hex')),
			root: box.root.toString('hex'),
			size: box.size,
		};
	}
}
