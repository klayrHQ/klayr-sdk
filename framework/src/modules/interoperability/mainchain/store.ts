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

import { NotFoundError } from '@liskhq/lisk-chain';
import { MODULE_ID_TOKEN } from '../../token/constants';
import { BaseInteroperabilityStore } from '../base_interoperability_store';
import {
	CCM_STATUS_CHANNEL_UNAVAILABLE,
	CCM_STATUS_OK,
	CHAIN_ACTIVE,
	CHAIN_REGISTERED,
	CROSS_CHAIN_COMMAND_ID_SIDECHAIN_TERMINATED,
	EMPTY_FEE_ADDRESS,
	LIVENESS_LIMIT,
	MODULE_ID_INTEROPERABILITY,
} from '../constants';
import { createCCMsgBeforeSendContext } from '../context';
import { CCMForwardContext, CCMsg, SendInternalContext } from '../types';
import {
	getEncodedSidechainTerminatedCCMParam,
	getIDAsKeyForStore,
	nullOnError,
	validateFormat,
} from '../utils';
import { TokenCCAPI } from '../cc_apis';

export class MainchainInteroperabilityStore extends BaseInteroperabilityStore {
	public async isLive(chainID: Buffer, timestamp: number): Promise<boolean> {
		const isTerminated = await this.hasTerminatedStateAccount(chainID);
		if (isTerminated) {
			return false;
		}

		const chainAccount = await this.getChainAccount(chainID);
		if (timestamp - chainAccount.lastCertificate.timestamp > LIVENESS_LIMIT) {
			return false;
		}

		return true;
	}

	public async forward(ccmForwardContext: CCMForwardContext): Promise<void> {
		const {
			ccm,
			eventQueue,
			logger,
			networkIdentifier,
			getAPIContext,
			getStore,
		} = ccmForwardContext;
		const apiContext = getAPIContext();
		const tokenCCAPI = this.interoperableModuleAPIs.get(MODULE_ID_TOKEN) as TokenCCAPI | undefined;
		const beforeCCMSendContext = createCCMsgBeforeSendContext({
			ccm,
			eventQueue,
			getAPIContext,
			logger,
			networkIdentifier,
			getStore,
			feeAddress: EMPTY_FEE_ADDRESS,
		});

		if (!tokenCCAPI) {
			throw new Error('TokenCCAPI does not exist.');
		}

		const receivingChainIDAsStoreKey = getIDAsKeyForStore(ccm.receivingChainID);
		const receivingChainAccount = await nullOnError(
			this.getChainAccount(receivingChainIDAsStoreKey),
		);

		const isLive = await this.isLive(receivingChainIDAsStoreKey, Date.now());

		if (receivingChainAccount?.status === CHAIN_ACTIVE && isLive) {
			const isTokenTransferred = await nullOnError(tokenCCAPI.forwardMessageFee(apiContext, ccm));

			if (!isTokenTransferred) {
				throw new Error('Could not forward message fee.');
			}

			await this.addToOutbox(receivingChainIDAsStoreKey, ccm);
			return;
		}

		if (ccm.status !== CCM_STATUS_OK) {
			throw new Error('CCM is invalid.');
		}

		await this.bounce(ccm);

		if (!receivingChainAccount || receivingChainAccount.status === CHAIN_REGISTERED) {
			throw new Error('Receiving chain does not exist or is not yet active.');
		}

		if (receivingChainAccount.status === CHAIN_ACTIVE) {
			await this.terminateChainInternal(ccm.receivingChainID, beforeCCMSendContext);
		}

		await this.sendInternal({
			beforeSendContext: beforeCCMSendContext,
			crossChainCommandID: CROSS_CHAIN_COMMAND_ID_SIDECHAIN_TERMINATED,
			moduleID: MODULE_ID_INTEROPERABILITY,
			fee: BigInt(0),
			params: getEncodedSidechainTerminatedCCMParam(ccm, receivingChainAccount),
			receivingChainID: ccm.sendingChainID,
			status: CCM_STATUS_OK,
			timestamp: Date.now(),
		});
	}

	public async bounce(ccm: CCMsg): Promise<void> {
		const terminatedStateAccountExists = await this.hasTerminatedStateAccount(
			getIDAsKeyForStore(ccm.sendingChainID),
		);

		// Messages from terminated chains are discarded, and never returned
		if (terminatedStateAccountExists) {
			return;
		}

		const newCCM = {
			...ccm,
			sendingChainID: ccm.receivingChainID,
			receivingChainID: ccm.sendingChainID,
			status: CCM_STATUS_CHANNEL_UNAVAILABLE,
		};

		await this.addToOutbox(getIDAsKeyForStore(newCCM.receivingChainID), newCCM);
	}

	public async sendInternal(sendContext: SendInternalContext): Promise<boolean> {
		const receivingChainIDAsStoreKey = getIDAsKeyForStore(sendContext.receivingChainID);
		let receivingChainAccount;
		try {
			// Chain has to exist on mainchain
			receivingChainAccount = await this.getChainAccount(receivingChainIDAsStoreKey);
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}

			return false;
		}

		// Chain must be live; This check is always on the receivingChainID
		const isReceivingChainLive = await this.isLive(
			receivingChainIDAsStoreKey,
			sendContext.timestamp,
		);
		if (!isReceivingChainLive) {
			return false;
		}
		// Chain status must be active
		if (receivingChainAccount.status !== CHAIN_ACTIVE) {
			return false;
		}

		const ownChainAccount = await this.getOwnChainAccount();
		// Create cross-chain message
		const ccm: CCMsg = {
			crossChainCommandID: sendContext.crossChainCommandID,
			fee: sendContext.fee,
			moduleID: sendContext.moduleID,
			nonce: ownChainAccount.nonce,
			params: sendContext.params,
			receivingChainID: sendContext.receivingChainID,
			sendingChainID: ownChainAccount.id,
			status: sendContext.status,
		};

		try {
			validateFormat(ccm);
		} catch (error) {
			return false;
		}

		for (const mod of this.interoperableModuleAPIs.values()) {
			if (mod?.beforeSendCCM) {
				try {
					await mod.beforeSendCCM(sendContext.beforeSendContext);
				} catch (error) {
					return false;
				}
			}
		}
		await this.addToOutbox(receivingChainIDAsStoreKey, ccm);
		ownChainAccount.nonce += BigInt(1);
		await this.setOwnChainAccount(ownChainAccount);

		return true;
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
