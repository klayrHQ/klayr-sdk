import { Modules } from 'klayr-sdk';

export const ccmsInfoSchema = {
	$id: 'msgRecoveryPlugin/ccmsFromEvents',
	type: 'object',
	properties: {
		ccms: {
			type: 'array',
			fieldNumber: 1,
			items: {
				...Modules.Interoperability.ccmSchema,
			},
		},
	},
};
