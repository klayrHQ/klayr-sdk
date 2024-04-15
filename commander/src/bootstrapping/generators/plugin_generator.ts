/*
 * KlayrHQ/klayr-commander
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
 *
 */

import { BaseGeneratorOptions } from '../../types';
import BaseGenerator from './base_generator';

export default class PluginGenerator extends BaseGenerator {
	protected _klayrPluginArgs: {
		name: string;
	};

	public constructor(args: string | string[], opts: { name: string } & BaseGeneratorOptions) {
		super(args, opts);
		this._klayrPluginArgs = {
			name: opts.name,
		};
	}

	public async initializing(): Promise<void> {
		await this._loadAndValidateTemplate();
	}

	public writing(): void {
		this.log('Generating plugin skeleton');
		this.composeWith(
			{
				Generator: this._klayrTemplate.generators.plugin,
				path: this._klayrTemplatePath,
			},
			this._klayrPluginArgs,
		);
	}

	public end(): void {
		this.log('\n\n');
		this.log('Finished creating plugin');
	}
}
