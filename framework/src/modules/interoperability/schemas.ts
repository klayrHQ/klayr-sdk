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

import { MAX_LENGTH_NAME, NUMBER_MAINCHAIN_VALIDATORS, MAX_NUM_VALIDATORS } from './constants';

export const channelSchema = {
	$id: '/modules/interoperability/channel',
	type: 'object',
	required: ['inbox', 'outbox', 'partnerChainOutboxRoot', 'messageFeeTokenID'],
	properties: {
		inbox: {
			type: 'object',
			fieldNumber: 1,
			required: ['appendPath', 'size', 'root'],
			properties: {
				appendPath: {
					type: 'array',
					items: {
						dataType: 'bytes',
					},
					fieldNumber: 1,
				},
				size: {
					dataType: 'uint32',
					fieldNumber: 2,
				},
				root: {
					dataType: 'bytes',
					fieldNumber: 3,
				},
			},
		},
		outbox: {
			type: 'object',
			fieldNumber: 2,
			required: ['appendPath', 'size', 'root'],
			properties: {
				appendPath: {
					type: 'array',
					items: {
						dataType: 'bytes',
					},
					fieldNumber: 1,
				},
				size: {
					dataType: 'uint32',
					fieldNumber: 2,
				},
				root: {
					dataType: 'bytes',
					fieldNumber: 3,
				},
			},
		},
		partnerChainOutboxRoot: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
		messageFeeTokenID: {
			type: 'object',
			fieldNumber: 4,
			required: ['chainID', 'localID'],
			properties: {
				chainID: {
					dataType: 'bytes',
					fieldNumber: 1,
				},
				localID: {
					dataType: 'bytes',
					fieldNumber: 2,
				},
			},
		},
	},
};

export const chainAccountSchema = {
	$id: '/modules/interoperability/chainAccount',
	type: 'object',
	required: ['name', 'networkID', 'lastCertificate', 'status'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
		networkID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		lastCertificate: {
			type: 'object',
			fieldNumber: 3,
			required: ['height', 'timestamp', 'stateRoot', 'validatorsHash'],
			properties: {
				height: {
					dataType: 'uint32',
					fieldNumber: 1,
				},
				timestamp: {
					dataType: 'uint32',
					fieldNumber: 2,
				},
				stateRoot: {
					dataType: 'bytes',
					fieldNumber: 3,
				},
				validatorsHash: {
					dataType: 'bytes',
					fieldNumber: 4,
				},
			},
		},
		status: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
	},
};

export const chainValidatorsSchema = {
	$id: '/modules/interoperability/chainValidators',
	type: 'object',
	required: ['activeValidators', 'certificateThreshold'],
	properties: {
		activeValidators: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
		certificateThreshold: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
	},
};

export const ownChainAccountSchema = {
	$id: '/modules/interoperability/ownChainAccount',
	type: 'object',
	required: ['name', 'id', 'nonce'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
		id: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		nonce: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
	},
};

export const outboxRootSchema = {
	$id: '/modules/interoperability/outbox',
	type: 'object',
	required: ['root'],
	properties: {
		root: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export const ccmSchema = {
	$id: '/modules/interoperability/ccm',
	type: 'object',
	required: [
		'nonce',
		'moduleID',
		'crossChainCommandID',
		'sendingChainID',
		'receivingChainID',
		'fee',
		'status',
		'params',
	],
	properties: {
		nonce: {
			dataType: 'uint64',
			fieldNumber: 1,
		},
		moduleID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		crossChainCommandID: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
		sendingChainID: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
		receivingChainID: {
			dataType: 'bytes',
			fieldNumber: 5,
		},
		fee: {
			dataType: 'uint64',
			fieldNumber: 6,
		},
		status: {
			dataType: 'uint32',
			fieldNumber: 7,
		},
		params: {
			dataType: 'bytes',
			fieldNumber: 8,
		},
	},
};

export const terminatedStateSchema = {
	$id: '/modules/interoperability/terminatedState',
	type: 'object',
	required: ['stateRoot'],
	properties: {
		stateRoot: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		mainchainStateRoot: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		initialized: {
			dataType: 'boolean',
			fieldNumber: 3,
		},
	},
};

export const terminatedOutboxSchema = {
	$id: '/modules/interoperability/terminatedOutbox',
	type: 'object',
	required: ['outboxRoot', 'outboxSize', 'partnerChainInboxSize'],
	properties: {
		outboxRoot: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		outboxSize: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		partnerChainInboxSize: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
	},
};

export const sidechainRegParams = {
	$id: '/modules/interoperability/mainchain/sidechainRegistration',
	type: 'object',
	required: ['name', 'genesisBlockID', 'initValidators', 'certificateThreshold'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 1,
			maxLength: MAX_LENGTH_NAME,
		},
		genesisBlockID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		initValidators: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
			minItems: 1,
			maxItems: MAX_NUM_VALIDATORS,
		},
		certificateThreshold: {
			dataType: 'uint64',
			fieldNumber: 4,
		},
	},
};

export const mainchainRegParams = {
	$id: '/modules/interoperability/sidechain/mainchainRegistration',
	type: 'object',
	required: ['ownChainID', 'ownName', 'mainchainValidators', 'signature', 'aggregationBits'],
	properties: {
		ownChainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		ownName: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 1,
			maxLength: MAX_LENGTH_NAME,
		},
		mainchainValidators: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
			minItems: NUMBER_MAINCHAIN_VALIDATORS,
			maxItems: NUMBER_MAINCHAIN_VALIDATORS,
		},
		signature: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
		aggregationBits: {
			dataType: 'bytes',
			fieldNumber: 5,
		},
	},
};

export const crossChainUpdateTransactionParams = {
	$id: '/modules/interoperability/ccu',
	type: 'object',
	required: [
		'sendingChainID',
		'certificate',
		'activeValidatorsUpdate',
		'newCertificateThreshold',
		'inboxUpdate',
	],
	properties: {
		sendingChainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		certificate: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		activeValidatorsUpdate: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
		newCertificateThreshold: {
			dataType: 'uint64',
			fieldNumber: 4,
		},
		inboxUpdate: {
			type: 'object',
			fieldNumber: 5,
			required: ['crossChainMessages', 'messageWitness', 'outboxRootWitness'],
			properties: {
				crossChainMessages: {
					type: 'array',
					fieldNumber: 1,
					items: { dataType: 'bytes' },
				},
				messageWitness: {
					type: 'object',
					fieldNumber: 2,
					required: ['partnerChainOutboxSize', 'siblingHashes'],
					properties: {
						partnerChainOutboxSize: {
							dataType: 'uint64',
							fieldNumber: 1,
						},
						siblingHashes: {
							type: 'array',
							fieldNumber: 2,
							items: { dataType: 'bytes' },
						},
					},
				},
				outboxRootWitness: {
					type: 'object',
					fieldNumber: 3,
					required: ['bitmap', 'siblingHashes'],
					properties: {
						bitmap: {
							dataType: 'bytes',
							fieldNumber: 1,
						},
						siblingHashes: {
							type: 'array',
							fieldNumber: 2,
							items: { dataType: 'bytes' },
						},
					},
				},
			},
		},
	},
};

export const messageRecoveryParamsSchema = {
	$id: '/modules/interoperability/mainchain/messageRecovery',
	type: 'object',
	required: ['chainID', 'crossChainMessages', 'idxs', 'siblingHashes'],
	properties: {
		chainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		crossChainMessages: {
			type: 'array',
			minItems: 1,
			items: {
				dataType: 'bytes',
			},
			fieldNumber: 2,
		},
		idxs: {
			type: 'array',
			items: {
				dataType: 'uint32',
			},
			fieldNumber: 3,
		},
		siblingHashes: {
			type: 'array',
			items: {
				dataType: 'bytes',
			},
			fieldNumber: 4,
		},
	},
};

// Cross chain commands schemas
export const registrationCCMParamsSchema = {
	$id: '/modules/interoperability/ccCommand/registration',
	type: 'object',
	required: ['networkID', 'name', 'messageFeeTokenID'],
	properties: {
		networkID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		name: {
			dataType: 'string',
			fieldNumber: 2,
		},
		messageFeeTokenID: {
			type: 'object',
			fieldNumber: 3,
			required: ['chainID', 'localID'],
			properties: {
				chainID: {
					dataType: 'bytes',
					fieldNumber: 1,
				},
				localID: {
					dataType: 'bytes',
					fieldNumber: 2,
				},
			},
		},
	},
};

export const channelTerminatedCCMParamsSchema = {
	$id: '/modules/interoperability/ccCommand/channelTerminated',
	type: 'object',
	properties: {},
};

export const sidechainTerminatedCCMParamsSchema = {
	$id: '/modules/interoperability/ccCommand/sidechainTerminated',
	type: 'object',
	required: ['chainID', 'stateRoot'],
	properties: {
		chainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		stateRoot: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};

export const nameSchema = {
	$id: '/modules/interoperability/name',
	type: 'object',
	required: ['name'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 1,
			maxLength: MAX_LENGTH_NAME,
		},
	},
};

// Note: Changed to lower-case `id` as ajv requires it
export const chainIDSchema = {
	$id: '/modules/interoperability/chainId',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export const chainIDSchemaDuplicate = {
	$id: '/modules/interoperability/chainIdDuplicate',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export const validatorsSchema = {
	$id: '/modules/interoperability/validators',
	type: 'object',
	required: ['activeValidators', 'certificateThreshold'],
	properties: {
		activeValidators: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
		certificateThreshold: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
	},
};

export const validatorsHashInputSchema = {
	$id: '/modules/interoperability/validatorsHashInput',
	type: 'object',
	required: ['activeValidators', 'certificateThreshold'],
	properties: {
		activeValidators: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: { dataType: 'bytes', fieldNumber: 1 },
					bftWeight: { dataType: 'uint64', fieldNumber: 2 },
				},
			},
		},
		certificateThreshold: { dataType: 'uint64', fieldNumber: 2 },
	},
};

export const registrationSignatureMessageSchema = {
	$id: '/modules/interoperability/sidechain/registrationSignatureMessage',
	type: 'object',
	required: ['ownChainID', 'ownName', 'mainchainValidators'],
	properties: {
		ownChainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		ownName: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 1,
			maxLength: MAX_LENGTH_NAME,
		},
		mainchainValidators: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['blsKey', 'bftWeight'],
				properties: {
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 48,
						maxLength: 48,
					},
					bftWeight: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
			minItems: NUMBER_MAINCHAIN_VALIDATORS,
			maxItems: NUMBER_MAINCHAIN_VALIDATORS,
		},
	},
};

export const stateRecoveryParamsSchema = {
	$id: '/modules/interoperability/mainchain/commands/stateRecovery',
	type: 'object',
	required: ['chainID', 'moduleID', 'storeEntries', 'siblingHashes'],
	properties: {
		chainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		moduleID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		storeEntries: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				properties: {
					storePrefix: {
						dataType: 'uint32',
						fieldNumber: 1,
					},
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 2,
					},
					storeValue: {
						dataType: 'bytes',
						fieldNumber: 3,
					},
					bitmap: {
						dataType: 'bytes',
						fieldNumber: 4,
					},
				},
				required: ['storePrefix', 'storeKey', 'storeValue', 'bitmap'],
			},
		},
		siblingHashes: {
			type: 'array',
			items: {
				dataType: 'bytes',
			},
			fieldNumber: 4,
		},
	},
};

export const stateRecoveryInitParams = {
	$id: '/modules/interoperability/mainchain/stateRecoveryInitialization',
	type: 'object',
	required: ['chainID', 'sidechainChainAccount', 'bitmap', 'siblingHashes'],
	properties: {
		chainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		sidechainChainAccount: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		bitmap: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
		siblingHashes: {
			type: 'array',
			items: {
				dataType: 'bytes',
			},
			fieldNumber: 4,
		},
	},
};

export const getChainAccountRequestSchema = {
	$id: '/modules/interoperability/endpoint/getChainAccountRequest',
	type: 'object',
	required: ['chainID'],
	properties: {
		chainID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export const getChainAccountResponseSchema = {
	$id: '/modules/interoperability/endpoint/getChainAccountResponse',
	type: 'object',
	required: ['chainID'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const getChannelRequestSchema = getChainAccountRequestSchema;

export const getTerminatedStateAccountRequestSchema = getChainAccountRequestSchema;

export const getTerminatedOutboxAccountRequestSchema = getChainAccountRequestSchema;

export const genesisInteroperabilityStoreSchema = {
	$id: '/interoperability/module/genesis',
	type: 'object',
	required: [
		'outboxRootSubstore',
		'chainDataSubstore',
		'channelDataSubstore',
		'chainValidatorsSubstore',
		'ownChainDataSubstore',
		'terminatedStateSubstore',
		'terminatedOutboxSubstore',
		'registeredNamesSubstore',
		'registeredNetworkIDsSubstore',
	],
	properties: {
		outboxRootSubstore: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...outboxRootSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		chainDataSubstore: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...chainAccountSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		channelDataSubstore: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...channelSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		chainValidatorsSubstore: {
			type: 'array',
			fieldNumber: 4,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...validatorsSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		ownChainDataSubstore: {
			type: 'array',
			fieldNumber: 5,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...ownChainAccountSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		terminatedStateSubstore: {
			type: 'array',
			fieldNumber: 6,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...terminatedStateSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		terminatedOutboxSubstore: {
			type: 'array',
			fieldNumber: 7,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...terminatedOutboxSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		registeredNamesSubstore: {
			type: 'array',
			fieldNumber: 8,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...chainIDSchema,
						fieldNumber: 2,
					},
				},
			},
		},
		registeredNetworkIDsSubstore: {
			type: 'array',
			fieldNumber: 9,
			items: {
				type: 'object',
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					storeValue: {
						...chainIDSchemaDuplicate,
						fieldNumber: 2,
					},
				},
			},
		},
	},
};
