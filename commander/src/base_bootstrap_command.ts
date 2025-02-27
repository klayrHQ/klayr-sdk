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
import { Command, Flags as flagParser } from '@oclif/core';
import { existsSync } from 'fs';
import { join } from 'path';
import { env } from './bootstrapping/env';

interface BootstrapFlags {
	readonly template?: string;
}

export default abstract class BaseBootstrapCommand extends Command {
	static flags = {
		template: flagParser.string({
			char: 't',
			description:
				'Template to bootstrap the application. It will read from `.klayrrc.json` or use `klayr-ts` if not found.',
		}),
	};

	public bootstrapFlags!: BootstrapFlags;

	async finally(error?: Error | string): Promise<void> {
		if (error) {
			this.error(error instanceof Error ? error.message : error);
		}
	}

	async init(): Promise<void> {
		const { flags } = await this.parse(this.constructor as never);
		this.bootstrapFlags = flags as BootstrapFlags;

		process.stdout.on('error', (err: { errno: string }): void => {
			if (err.errno !== 'EPIPE') {
				throw err;
			}
		});
	}

	protected _isKlayrappDir(path: string): boolean {
		return existsSync(join(path, '.klayrrc.json'));
	}

	protected async _runBootstrapCommand(
		command: string,
		opts?: Record<string, unknown>,
	): Promise<void> {
		await env.run(command, {
			...opts,
			template: this.bootstrapFlags.template,
			version: this.config.version,
		});
	}
}
