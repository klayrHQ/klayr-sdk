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
import { BaseEvent, EventQueuer } from '../../base_event';
import {
	TOKEN_ID_LENGTH,
	TokenEventResult,
	TokenErrorEventResult,
	HASH_LENGTH,
} from '../constants';

export interface BeforeCCMForwardingEventData {
	ccmID: Buffer;
	messageFeeTokenID: Buffer;
}

export const beforeCCMForwardingEventSchema = {
	$id: '/token/events/beforeCCMForwarding',
	type: 'object',
	required: ['ccmID', 'messageFeeTokenID', 'result'],
	properties: {
		ccmID: {
			dataType: 'bytes',
			minLength: HASH_LENGTH,
			maxLength: HASH_LENGTH,
			fieldNumber: 1,
		},
		messageFeeTokenID: {
			dataType: 'bytes',
			minLength: TOKEN_ID_LENGTH,
			maxLength: TOKEN_ID_LENGTH,
			fieldNumber: 2,
		},
		result: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
	},
};

export class BeforeCCMForwardingEvent extends BaseEvent<
	BeforeCCMForwardingEventData & { result: TokenEventResult }
> {
	public schema = beforeCCMForwardingEventSchema;

	public log(
		ctx: EventQueuer,
		sendingChainID: Buffer,
		receivingChainID: Buffer,
		data: BeforeCCMForwardingEventData,
	): void {
		this.add(ctx, { ...data, result: TokenEventResult.SUCCESSFUL }, [
			sendingChainID,
			receivingChainID,
		]);
	}

	public error(
		ctx: EventQueuer,
		sendingChainID: Buffer,
		receivingChainID: Buffer,
		data: BeforeCCMForwardingEventData,
		result: TokenErrorEventResult,
	): void {
		this.add(ctx, { ...data, result }, [sendingChainID, receivingChainID], true);
	}
}
