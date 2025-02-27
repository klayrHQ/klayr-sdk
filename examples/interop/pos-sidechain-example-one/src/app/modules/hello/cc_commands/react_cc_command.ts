/* eslint-disable class-methods-use-this */

import { Modules, codec, cryptography, db } from 'klayr-sdk';
import { CCReactMessageParamsSchema } from '../schemas';
import { CCReactMessageParams } from '../types';
import { MAX_RESERVED_ERROR_STATUS, CROSS_CHAIN_COMMAND_REACT } from '../constants';
import { ReactionStore, ReactionStoreData } from '../stores/reaction';
import { MessageStore } from '../stores/message';

export class ReactCCCommand extends Modules.Interoperability.BaseCCCommand {
	public schema = CCReactMessageParamsSchema;

	public get name(): string {
		return CROSS_CHAIN_COMMAND_REACT;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(ctx: Modules.Interoperability.CrossChainMessageContext): Promise<void> {
		const { ccm } = ctx;

		if (ccm.status > MAX_RESERVED_ERROR_STATUS) {
			throw new Error('Invalid CCM status code.');
		}

		const ccReactMessageParams = codec.decode<CCReactMessageParams>(
			CCReactMessageParamsSchema,
			ccm.params,
		);
		const messageCreatorAddress = cryptography.address.getAddressFromKlayr32Address(
			ccReactMessageParams.helloMessageID,
		);
		if (!(await this.stores.get(MessageStore).has(ctx, messageCreatorAddress))) {
			throw new Error('Message ID does not exists.');
		}
	}

	public async execute(ctx: Modules.Interoperability.CrossChainMessageContext): Promise<void> {
		const { ccm, logger, transaction } = ctx;
		logger.info('Executing React CCM');

		// Decode the provided CCM parameters
		const ccReactMessageParams = codec.decode<CCReactMessageParams>(
			CCReactMessageParamsSchema,
			ccm.params,
		);
		logger.info(ccReactMessageParams, 'parameters');

		// Get helloMessageID and reactionType from the parameters
		const { helloMessageID, reactionType } = ccReactMessageParams;
		const { senderAddress } = transaction;
		const reactionSubstore = this.stores.get(ReactionStore);
		const msgCreatorAddress = cryptography.address.getAddressFromKlayr32Address(helloMessageID);

		let msgReactions: ReactionStoreData;
		// Get existing reactions for a Hello message, or initialize an empty reaction object, if none exists,yet.
		try {
			msgReactions = await reactionSubstore.get(ctx, msgCreatorAddress);
		} catch (error) {
			if (!(error instanceof db.NotFoundError)) {
				logger.error(
					{
						helloMessageID,
						crossChainCommand: this.name,
						error,
					},
					'Error when getting the reaction substore',
				);
				throw error;
			}
			logger.info(
				{ helloMessageID, crossChainCommand: this.name },
				`No entry exists for given helloMessageID ${helloMessageID}. Creating a default entry.`,
			);
			msgReactions = { reactions: { likes: [] } };
		}

		let { likes } = msgReactions.reactions;
		// Check if the reactions is a like
		if (reactionType === 0) {
			const likedPos = likes.indexOf(senderAddress);
			// If the sender has already liked the message
			if (likedPos > -1) {
				// Remove the sender address from the likes for the message
				likes = likes.splice(likedPos, 1);
				// If the sender has not liked the message yet
			} else {
				// Add the sender address to the likes of the message
				likes.push(senderAddress);
			}
		} else {
			logger.error({ reactionType }, 'invalid reaction type');
		}

		msgReactions.reactions.likes = likes;
		// Update the reaction store with the reactions for the specified Hello message
		await reactionSubstore.set(ctx, msgCreatorAddress, msgReactions);
	}
}
