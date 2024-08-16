/*
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
 */

import * as os from 'os';
import { systemDirs } from '../../src/system_dirs';

beforeEach(() => {
	jest.spyOn(os, 'homedir').mockReturnValue('/user');
});

describe('systemDirs', () => {
	it('Should return directories configuration with dataPath.', () => {
		// Arrange
		const appLabel = 'LABEL';

		// Act
		const dirsObj = systemDirs(`~/.klayr/${appLabel}`);

		// Assert
		expect(dirsObj).toEqual({
			config: `/user/.klayr/${appLabel}/config`,
			dataPath: `/user/.klayr/${appLabel}`,
			data: `/user/.klayr/${appLabel}/data`,
			tmp: `/user/.klayr/${appLabel}/tmp`,
			logs: `/user/.klayr/${appLabel}/logs`,
			sockets: `/user/.klayr/${appLabel}/tmp/sockets`,
			pids: `/user/.klayr/${appLabel}/tmp/pids`,
			plugins: `/user/.klayr/LABEL/plugins`,
		});
	});

	it('Should be able to resolve relative path correctly.', () => {
		// Arrange
		const appLabel = 'LABEL';
		const rootPath = '/user/../.klayr';

		// Act
		const dirsObj = systemDirs(`${rootPath}/${appLabel}`);

		// Assert
		expect(dirsObj).toEqual({
			config: `/.klayr/${appLabel}/config`,
			dataPath: `/.klayr/${appLabel}`,
			data: `/.klayr/${appLabel}/data`,
			tmp: `/.klayr/${appLabel}/tmp`,
			logs: `/.klayr/${appLabel}/logs`,
			sockets: `/.klayr/${appLabel}/tmp/sockets`,
			pids: `/.klayr/${appLabel}/tmp/pids`,
			plugins: `/.klayr/${appLabel}/plugins`,
		});
	});

	it('Should be able to resolve absolute path correctly.', () => {
		// Arrange
		const appLabel = 'LABEL';
		const rootPath = '/customPath/.klayr';

		// Act
		const dirsObj = systemDirs(`${rootPath}/${appLabel}`);

		// Assert
		expect(dirsObj).toEqual({
			config: `/customPath/.klayr/${appLabel}/config`,
			dataPath: `/customPath/.klayr/${appLabel}`,
			data: `/customPath/.klayr/${appLabel}/data`,
			tmp: `/customPath/.klayr/${appLabel}/tmp`,
			logs: `/customPath/.klayr/${appLabel}/logs`,
			sockets: `/customPath/.klayr/${appLabel}/tmp/sockets`,
			pids: `/customPath/.klayr/${appLabel}/tmp/pids`,
			plugins: `/customPath/.klayr/${appLabel}/plugins`,
		});
	});

	it('Should be able to resolve home path correctly.', () => {
		// Arrange
		const appLabel = 'LABEL';
		const rootPath = '~/.klayr';

		// Act
		const dirsObj = systemDirs(`${rootPath}/${appLabel}`);

		// Assert
		expect(dirsObj).toEqual({
			config: `/user/.klayr/${appLabel}/config`,
			dataPath: `/user/.klayr/${appLabel}`,
			data: `/user/.klayr/${appLabel}/data`,
			tmp: `/user/.klayr/${appLabel}/tmp`,
			logs: `/user/.klayr/${appLabel}/logs`,
			sockets: `/user/.klayr/${appLabel}/tmp/sockets`,
			pids: `/user/.klayr/${appLabel}/tmp/pids`,
			plugins: `/user/.klayr/${appLabel}/plugins`,
		});
	});
});
