import { Schema } from '@klayr/codec';
import { Flags as flagParser } from '@oclif/core';
import { BaseIPCClientCommand } from '../base_ipc_client';

export class ListCommand extends BaseIPCClientCommand {
	static description = 'Lists registered endpoints.';

	static examples = [
		'endpoint:list',
		'endpoint:list {endpoint} -m {module}',
		'endpoint:list {endpoint} -m {module} -i',
		'endpoint:list -m validator',
		'endopint:list getBalance',
		'endpoint:list get -m token ',
		'endpoint:list getBalances -m token -i --pretty',
		'endpoint:list getBalances -m token -d ~/.klayr/pos-mainchain',
	];

	static args = [
		{
			name: 'endpoint',
			description: 'Endpoint name (Optional)',
			required: false,
		},
	];

	static flags = {
		...BaseIPCClientCommand.flags,
		module: flagParser.string({
			char: 'm',
			description: 'Parent module.',
		}),
		info: flagParser.boolean({
			char: 'i',
			description: 'Prints additional info; Request and Response objects.',
		}),
	};

	async run(): Promise<void> {
		const { args, flags } = await this.parse(ListCommand);

		if (!this._client) {
			this.error('APIClient is not initialized.');
		}

		let modules;
		let result;

		if (flags.module === undefined) {
			modules = this._client.metadata;
		} else {
			modules = this._client.metadata.filter(moduleData => moduleData.name.match(flags.module!));
		}

		const initialValue: {
			name: string;
			request?: Schema;
			response: Schema;
		}[] = [];

		if (args.endpoint !== undefined) {
			const searchExpression = new RegExp(args.endpoint, 'i');

			result = modules.reduce((aggregatedResult, klayrmodule) => {
				const endpoints = klayrmodule.endpoints
					.filter(endpoint => endpoint.name.match(searchExpression))
					.map(endpoint => ({ ...endpoint, name: `${klayrmodule.name}_${endpoint.name}` }));

				return aggregatedResult.concat(endpoints);
			}, initialValue);
		} else {
			result = modules.reduce(
				(aggregatedResult, klayrmodule) =>
					aggregatedResult.concat(
						klayrmodule.endpoints.map(endpoint => ({
							...endpoint,
							name: `${klayrmodule.name}_${endpoint.name}`,
						})),
					),
				initialValue,
			);
		}

		if (flags.info) {
			this.printJSON(result as unknown as Record<string, unknown>);
		} else {
			this.printJSON(result.map(item => item.name) as unknown as Record<string, unknown>);
		}
	}
}
