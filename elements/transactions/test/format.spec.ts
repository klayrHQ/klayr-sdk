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
 *
 */
import { convertBeddowsTokly, convertklyToBeddows } from '../src/format';

describe('format', () => {
	describe('#convertBeddowsTokly', () => {
		it('should error if not given a string', () => {
			return expect(convertBeddowsTokly.bind(null, 12345678 as any)).toThrow(
				'Cannot convert non-string amount',
			);
		});
		it('should error on 0.1', () => {
			return expect(convertBeddowsTokly.bind(null, '0.1')).toThrow(
				'Beddows amount should not have decimal points',
			);
		});
		it('should error on 18446744073709551616', () => {
			return expect(convertBeddowsTokly.bind(null, '18446744073709551616')).toThrow(
				'Beddows amount out of range',
			);
		});
		it('should convert 100000000 to 1', () => {
			return expect(convertBeddowsTokly('100000000')).toBe('1');
		});
		it('should convert 10000000 to 0.1', () => {
			return expect(convertBeddowsTokly('10000000')).toBe('0.1');
		});
		it('should convert 1 to 0.00000001', () => {
			return expect(convertBeddowsTokly('1')).toBe('0.00000001');
		});
		it('should convert 10000000000000000 to 100000000', () => {
			return expect(convertBeddowsTokly('10000000000000000')).toBe('100000000');
		});
		it('should convert 18446744073709551615 to 184467440737.09551615', () => {
			return expect(convertBeddowsTokly('18446744073709551615')).toBe('184467440737.09551615');
		});
	});
	describe('#convertklyToBeddows', () => {
		it('should error if not given a string', () => {
			return expect(convertklyToBeddows.bind(null, 12345678 as any)).toThrow(
				'Cannot convert non-string amount',
			);
		});
		it('should error on 0.000000001', () => {
			return expect(convertklyToBeddows.bind(null, '0.000000001')).toThrow(
				'KLY amount has too many decimal points',
			);
		});
		it('should error on 184467440737.09551616', () => {
			return expect(convertklyToBeddows.bind(null, '184467440737.09551616')).toThrow(
				'KLY amount out of range',
			);
		});
		it('should convert 1 to 100000000', () => {
			return expect(convertklyToBeddows('1')).toBe('100000000');
		});
		it('should convert 0.1 to 10000000', () => {
			return expect(convertklyToBeddows('0.1')).toBe('10000000');
		});
		it('should convert 0.00000001 to 1', () => {
			return expect(convertklyToBeddows('0.00000001')).toBe('1');
		});
		it('should convert 100000000 to 10000000000000000', () => {
			return expect(convertklyToBeddows('100000000')).toBe('10000000000000000');
		});
		it('should convert 92233720368.54775807 to 9223372036854775807', () => {
			return expect(convertklyToBeddows('92233720368.54775807')).toBe('9223372036854775807');
		});
	});
});
