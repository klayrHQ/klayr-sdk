/*
 * KlayrHQ/klayr-commander
 * Copyright © 2019 Lisk Foundation
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
import { getConfig } from '../../../helpers/config';
import { VerifyCommand } from '../../../../src/commands/message/verify';
import * as readerUtils from '../../../../src/utils/reader';
import { Awaited } from '../../../types';

describe('message:verify', () => {
	const message = 'Hello World';
	const publicKey = 'f1f9fb8717a6a3cc1213221e4bc3426e547407150947272e4f4b729a61726437';
	const signature =
		'61b986e8e8e23b877291c1ec4f9c4da0ad48a3e7a4fbad16c464edd2dfc12a42b5d9d3ac42fdf7ea99ca3f4198be09fead4161c6466ffab0ba8f5ca534bc0f05';
	const defaultVerifyMessageResult = '{"verified":true}\n';
	const messageSource = 'file:/message.txt';

	let stdout: string[];
	let stderr: string[];
	let config: Awaited<ReturnType<typeof getConfig>>;

	beforeEach(async () => {
		stdout = [];
		stderr = [];
		config = await getConfig();
		jest.spyOn(process.stdout, 'write').mockImplementation(val => stdout.push(val as string) > -1);
		jest.spyOn(process.stderr, 'write').mockImplementation(val => stderr.push(val as string) > -1);
		jest.spyOn(readerUtils, 'readFileSource').mockResolvedValue(message);
	});

	describe('message:verify', () => {
		it('should throw an error when arg is not provided', async () => {
			await expect(VerifyCommand.run([], config)).rejects.toThrow('Missing 2 required arg');
		});
	});

	describe('message:verify publicKey', () => {
		it('should throw an error when arg is not provided', async () => {
			await expect(VerifyCommand.run([publicKey], config)).rejects.toThrow(
				'Missing 1 required arg',
			);
		});
	});

	describe('message:verify publicKey signature', () => {
		it('should throw an error when message is not provided', async () => {
			await expect(VerifyCommand.run([publicKey, signature], config)).rejects.toThrow(
				'No message was provided.',
			);
		});
	});

	describe('message:verify publicKey signature message', () => {
		it('should verify message from the arg', async () => {
			await VerifyCommand.run([publicKey, signature, message, '-j'], config);
			expect(process.stdout.write).toHaveBeenCalledWith(defaultVerifyMessageResult);
		});
	});

	describe('message:verify publicKey signature --message=file:./message.txt', () => {
		it('should verify message from the flag', async () => {
			await VerifyCommand.run([publicKey, signature, `--message=${messageSource}`, '-j'], config);
			expect(process.stdout.write).toHaveBeenCalledWith(defaultVerifyMessageResult);
		});
	});
});
