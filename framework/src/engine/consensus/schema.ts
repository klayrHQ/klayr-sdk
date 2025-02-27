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
 */
export interface RPCBlocksByIdData {
	readonly blockId: Buffer;
}

export const getBlocksFromIdRequestSchema = {
	$id: 'klayr/getBlocksFromIdRequest',
	title: 'Get Blocks From Id Request',
	type: 'object',
	required: ['blockId'],
	properties: {
		blockId: {
			fieldNumber: 1,
			dataType: 'bytes',
			minLength: 32,
			maxLength: 32,
		},
	},
};

export const getBlocksFromIdResponseSchema = {
	$id: 'klayr/getBlocksFromIdResponse',
	title: 'Get Blocks From Id Response',
	type: 'object',
	required: ['blocks'],
	properties: {
		blocks: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
	},
};

export const getHighestCommonBlockRequestSchema = {
	$id: '/klayr/getHighestCommonBlockRequest',
	title: 'Get Highest Common Block Request',
	type: 'object',
	required: ['ids'],
	properties: {
		ids: {
			type: 'array',
			fieldNumber: 1,
			minItems: 1,
			items: {
				dataType: 'bytes',
				minLength: 32,
				maxLength: 32,
			},
		},
	},
};

export interface RPCHighestCommonBlockRequest {
	readonly ids: Buffer[];
}

export const getHighestCommonBlockResponseSchema = {
	$id: '/klayr/getHighestCommonBlockResponse',
	title: 'Get Highest Common Block Response',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'bytes',
			fieldNumber: 1,
			minLength: 32,
			maxLength: 32,
		},
	},
};

export interface RPCHighestCommonBlockResponse {
	readonly id: Buffer;
}

export interface EventPostBlockData {
	readonly block: Buffer;
}

export const postBlockEventSchema = {
	$id: '/klayr/postBlockEvent',
	title: 'Post Block Event',
	type: 'object',
	required: ['block'],
	properties: {
		block: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};
