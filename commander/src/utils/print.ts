/*
 * LiskHQ/klayr-commander
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
// eslint-disable-next-line camelcase
import strip_ansi = require('strip-ansi');

// eslint-disable-next-line import/first
import { tablify } from './tablify';

export interface StringMap {
	readonly [key: string]: string;
}

interface PrintInput {
	readonly json?: boolean;
	readonly pretty?: boolean;
}

interface Printer {
	log: (message?: string, ...args: unknown[]) => void;
}

const removeANSIFromObject = (object: StringMap) =>
	Object.entries(object).reduce<StringMap>(
		(strippedResult, [key, value]) => ({
			...strippedResult,
			[key]: strip_ansi(value),
		}),
		{},
	);

const isStringMapArray = (
	result: ReadonlyArray<StringMap> | StringMap,
): result is ReadonlyArray<StringMap> => Array.isArray(result);

const removeANSI = (result: ReadonlyArray<StringMap> | StringMap) =>
	isStringMapArray(result) ? result.map(removeANSIFromObject) : removeANSIFromObject(result);

export const print = ({ json, pretty }: PrintInput = {}) =>
	function printResult(this: Printer, result: ReadonlyArray<StringMap> | StringMap): void {
		const resultToPrint = json ? removeANSI(result) : result;

		const output = json
			? JSON.stringify(resultToPrint, undefined, pretty ? '\t' : undefined)
			: tablify(resultToPrint).toString();

		const logger = this && typeof this.log === 'function' ? this : console;
		logger.log(output);
	};
