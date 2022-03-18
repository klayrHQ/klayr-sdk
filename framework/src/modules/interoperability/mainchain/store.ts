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

import { BaseInteroperabilityStore } from '../base_interoperability_store';
import {
	LIVENESS_LIMIT,
	MAINCHAIN_ID,
	MODULE_ID_INTEROPERABILITY,
	STORE_PREFIX_CHAIN_DATA,
	STORE_PREFIX_TERMINATED_STATE,
} from '../constants';
import {
	CCMsg,
	CCUpdateParams,
	ChainAccount,
	SendInternalContext,
	TerminatedStateAccount,
} from '../types';
import { chainAccountSchema, terminatedChain } from '../schema';

export class MainchainInteroperabilityStore extends BaseInteroperabilityStore {
	public async isLive(chainID: Buffer, timestamp: number): Promise<boolean> {
		if (chainID.equals(Buffer.from(MAINCHAIN_ID.toString(16), 'hex'))) {
			return true;
		}

		const isTerminated = await this.getTerminatedStateAccount(chainID);
		if (isTerminated) {
			return false;
		}

		if (
			timestamp - (await this.getChainAccount(chainID)).lastCertificate.timestamp >
			LIVENESS_LIMIT
		) {
			return false;
		}

		return true;
	}

	public async getChainAccount(chainID: Buffer): Promise<ChainAccount> {
		const chainSubstore = this.getStore(MODULE_ID_INTEROPERABILITY, STORE_PREFIX_CHAIN_DATA);
		return chainSubstore.getWithSchema<ChainAccount>(chainID, chainAccountSchema);
	}

	public async getTerminatedStateAccount(chainID: Buffer): Promise<TerminatedStateAccount> {
		const terminatedChainSubstore = this.getStore(
			MODULE_ID_INTEROPERABILITY,
			STORE_PREFIX_TERMINATED_STATE,
		);
		return terminatedChainSubstore.getWithSchema<TerminatedStateAccount>(chainID, terminatedChain);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async appendToOutboxTree(chainID: number, appendData: Buffer): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID, appendData);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async addToOutbox(chainID: Buffer, ccm: CCMsg): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID, ccm);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async appendToInboxTree(chainID: number, appendData: Buffer): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID, appendData);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply(ccu: CCUpdateParams, ccm: CCMsg): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(ccu, ccm);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async sendInternal(sendContext: SendInternalContext): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(sendContext);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getChannel(chainID: number): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async createTerminatedStateAccount(chainID: Buffer, stateRoot?: Buffer): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID, stateRoot);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async terminateChainInternal(chainID: number): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async createTerminatedOutboxAccount(
		chainID: number,
		outboxRoot: Buffer,
		outboxSize: bigint,
		partnerChainInboxSize: bigint,
	): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID, outboxRoot, outboxSize, partnerChainInboxSize);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getInboxRoot(chainID: number): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async getOutboxRoot(chainID: number): Promise<void> {
		// eslint-disable-next-line no-console
		console.log(chainID);
	}
}
