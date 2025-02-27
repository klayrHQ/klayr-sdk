/*
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
 */

import { Modules, codec, tree } from 'klayr-sdk';
import { CCMWithHeight, LastSentCCM } from './types';

/**
 * @see https://github.com/LiskHQ/lips/blob/main/proposals/lip-0053.md#messagewitnesshashes
 *
 * Calculates messageWitnessHashes if there are any pending ccms as well as it filters out ccms
 * based on last sent ccm nonce.
 * Also, it checks whether a list of ccm can fit into a CCU based on maxCCUSize
 *
 * @param sendingChainChannelInfo Channel info of the sendingChain stored on receivingChain
 * @param ccmsToBeIncluded Filtered list of CCMs that can be included for a given certificate
 * @param lastSentCCMInfo Last send CCM info which is used to filter out ccms
 * @param maxCCUSize Max size of CCU based of which number of ccms are selected
 * @return {
		crossChainMessages: Buffer[];
		messageWitnessHashes: Buffer[];
		lastCCMToBeSent: LastSentCCMWithHeight | undefined;
	}
 */
export const calculateMessageWitnesses = (
	inboxSizeOnReceivingChain: number,
	outboxSizeOnSendingChain: number,
	lastSentCCM: {
		nonce: bigint;
		height: number;
	},
	ccmsToBeIncluded: CCMWithHeight[],
	maxCCUSize: number,
): {
	crossChainMessages: Buffer[];
	messageWitnessHashes: Buffer[];
	lastCCMToBeSent: LastSentCCM | undefined;
} => {
	const allSerializedCCMs = [];
	const includedSerializedCCMs = [];
	let lastCCMWithHeight;
	let totalSize = 0;
	// Make an array of ccms with nonce greater than last sent ccm nonce
	for (const ccm of ccmsToBeIncluded) {
		if (ccm.height !== 0 && lastSentCCM.height === ccm.height && ccm.nonce === lastSentCCM.nonce) {
			continue;
		}
		if (inboxSizeOnReceivingChain < outboxSizeOnSendingChain) {
			const ccmBytes = codec.encode(Modules.Interoperability.ccmSchema, ccm);
			totalSize += ccmBytes.length;
			if (totalSize < maxCCUSize) {
				includedSerializedCCMs.push(ccmBytes);
				lastCCMWithHeight = { ...ccm, height: ccm.height };
			}
			allSerializedCCMs.push(ccmBytes);
		}
	}

	// Return empty inboxUpdate when there is no CCM
	if (includedSerializedCCMs.length < 1) {
		return {
			crossChainMessages: [],
			messageWitnessHashes: [],
			lastCCMToBeSent: undefined,
		};
	}

	// When all the ccms are included then keep the messageWitnessHashes empty
	if (includedSerializedCCMs.length === allSerializedCCMs.length) {
		return {
			crossChainMessages: includedSerializedCCMs,
			messageWitnessHashes: [],
			lastCCMToBeSent: {
				...(lastCCMWithHeight as LastSentCCM),
				outboxSize: outboxSizeOnSendingChain,
			},
		};
	}

	const remainingSerializedCCMs = allSerializedCCMs.slice(includedSerializedCCMs.length);
	// Generate messageWitness
	const messageWitnessHashes = tree.regularMerkleTree.calculateRightWitness(
		inboxSizeOnReceivingChain + includedSerializedCCMs.length,
		remainingSerializedCCMs,
	);

	return {
		crossChainMessages: includedSerializedCCMs,
		messageWitnessHashes,
		lastCCMToBeSent: {
			...(lastCCMWithHeight as LastSentCCM),
			outboxSize: outboxSizeOnSendingChain,
		},
	};
};
