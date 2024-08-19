/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line
/// <reference path="../../../external_types/yeoman-generator/lib/actions/install.d.ts" />
/*
 * LiskHQ/klayr-commander
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

import * as YeomanGenerator from 'yeoman-generator';
import * as Storage from 'yeoman-generator/lib/util/storage';
import * as installActions from 'yeoman-generator/lib/actions/install';
import { join, dirname } from 'path';
import * as assert from 'assert';
import { BaseGeneratorOptions, Klayrtemplate } from '../../types';

Object.assign(YeomanGenerator.prototype, installActions);

const DEFAULT_TEMPLATE_NAME = 'klayr-ts';

export default abstract class BaseGenerator extends YeomanGenerator {
	protected readonly _klayrTemplatePath: string;
	protected readonly _klayrTemplateName: string;
	protected readonly _klayrRC: Storage;
	protected readonly _commanderVersion: string;
	protected _klayrTemplate!: Klayrtemplate;
	protected _registry?: string;

	public constructor(args: string | string[], opts: BaseGeneratorOptions) {
		super(args, opts);

		if (opts.projectPath) {
			this.destinationRoot(opts.projectPath);
		}
		this._registry = opts.registry;

		this._klayrRC = this.createStorage('.klayrrc.json');
		this._klayrTemplateName = opts.template ?? this._klayrRC.getPath('template') ?? 'klayr-ts';
		this._commanderVersion = opts.version;

		if (this._klayrTemplateName === DEFAULT_TEMPLATE_NAME) {
			this._klayrTemplatePath = join(dirname(__filename), '..', 'templates', 'klayr-template-ts');
		} else {
			this._klayrTemplatePath = require.resolve(this._klayrTemplateName);
		}

		this.log(`Using template "${this._klayrTemplateName}"`);
		this._klayrRC.setPath('commander.version', this._commanderVersion);
		this._klayrRC.setPath('template', this._klayrTemplateName);

		this.sourceRoot(this._klayrTemplatePath);
	}

	protected async _loadAndValidateTemplate(): Promise<void> {
		this._klayrTemplate = (await import(this._klayrTemplatePath)) as Klayrtemplate;

		assert(
			this._klayrTemplate.generators,
			`Template "${this._klayrTemplateName}" does not have any generators`,
		);

		assert(
			this._klayrTemplate.generators.init,
			`Template "${this._klayrTemplateName}" does not have "init" generators`,
		);
	}
}
