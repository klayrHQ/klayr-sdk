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
import {
	getAddressFromPublicKey,
	getKlayr32AddressFromPublicKey,
	getAddressFromPrivateKey,
	validateKlayr32Address,
	getAddressFromKlayr32Address,
	getKlayr32AddressFromAddress,
} from '../src/address';
import {
	KLAYR32_CHARSET,
	DEFAULT_KLAYR32_ADDRESS_PREFIX,
	KLAYR32_ADDRESS_LENGTH,
	ED25519_PUBLIC_KEY_LENGTH,
} from '../src/constants';
import * as utils from '../src/utils';

describe('address', () => {
	const defaultPassphraseHash = '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b';
	const defaultPrivateKey = Buffer.from(
		'2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
		'hex',
	);
	const defaultPublicKey = Buffer.from(
		'5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
		'hex',
	);
	const defaultAddress = Buffer.from('2bb80d537b1da3e38bd30361aa855686bde0eacd', 'hex');

	beforeEach(() => {
		jest.spyOn(utils, 'hash').mockReturnValue(Buffer.from(defaultPassphraseHash, 'hex'));
	});

	describe('#getAddressFromPrivateKey', () => {
		it('should create correct address', () => {
			expect(getAddressFromPrivateKey(defaultPrivateKey.subarray(0, 64))).toEqual(defaultAddress);
		});
	});

	describe('#getAddressFromPublicKey', () => {
		it('should generate address from publicKey', () => {
			const address = getAddressFromPublicKey(defaultPublicKey);
			expect(address).toEqual(defaultAddress);
		});
	});

	describe('#getKlayr32AddressFromPublicKey', () => {
		it('should reject when publicKey length not equal to ED25519_PUBLIC_KEY_LENGTH', () => {
			expect(() =>
				getKlayr32AddressFromPublicKey(
					Buffer.alloc(ED25519_PUBLIC_KEY_LENGTH - 1),
					DEFAULT_KLAYR32_ADDRESS_PREFIX,
				),
			).toThrow(`publicKey length must be ${ED25519_PUBLIC_KEY_LENGTH}.`);
		});

		it('should generate klayr32 address from publicKey', () => {
			const address = getKlayr32AddressFromPublicKey(
				defaultPublicKey,
				DEFAULT_KLAYR32_ADDRESS_PREFIX,
			);

			expect(address).toBe(getKlayr32AddressFromAddress(defaultAddress));
		});
	});

	describe('#validateKlayr32Address', () => {
		describe('Given valid addresses', () => {
			const addresses = [
				'kly24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
				'klyoaknq582o6fw7sp82bm2hnj7pzp47mpmbmux2g',
				'klyqf5xbhu874yqg89k449zk2fctj46fona9bafgr',
				'klyamc9kfzenupkgexyxsf4qz9fv8mo9432of9p5j',
				'kly6xevdsz3dpqfsx2u6mg3jx9zk8xqdozvn7x5ur',
			];

			it('should return true', () => {
				for (const address of addresses) {
					expect(validateKlayr32Address(address)).toBeTrue();
				}
			});
		});

		describe('Given an address that is too short', () => {
			const address = 'kly1';
			it('should throw an error', () => {
				expect(() => validateKlayr32Address(address)).toThrow(
					`Address length does not match requirements. Expected ${KLAYR32_ADDRESS_LENGTH} characters.`,
				);
			});
		});

		describe('Given an address that is too long', () => {
			const address = 'klyoaknq582o6fw7sp82bm2hnj7pzp47mpmbmux2ga';
			it('should throw an error', () => {
				expect(() => validateKlayr32Address(address)).toThrow(
					`Address length does not match requirements. Expected ${KLAYR32_ADDRESS_LENGTH} characters.`,
				);
			});
		});

		describe('Given an address that is not prefixed with `kly`', () => {
			const address = 'KLY24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu';
			it('should throw an error', () => {
				expect(() => validateKlayr32Address(address)).toThrow(
					`Invalid address prefix. Actual prefix: KLY, Expected prefix: ${DEFAULT_KLAYR32_ADDRESS_PREFIX}`,
				);
			});
		});

		describe('Given an address containing non-klayr32 characters', () => {
			const address = 'kly1aknq582o6fw7sp82bm2hnj7pzp47mpmbmux2g';
			it('should throw an error', () => {
				expect(() => validateKlayr32Address(address)).toThrow(
					`Invalid character found in address. Only allow characters: '${KLAYR32_CHARSET}'.`,
				);
			});
		});

		describe('Given an address with invalid checksum', () => {
			const address = 'klyoaknq582o6fw7sp82bm2hnj7pzp47mpmbmuxgg';
			it('should throw an error', () => {
				expect(() => validateKlayr32Address(address)).toThrow('Invalid checksum for address.');
			});
		});
	});

	describe('getAddressFromKlayr32Address', () => {
		const account = {
			passphrase:
				'boil typical oyster traffic ethics timber envelope undo lecture poverty space keep',
			privateKey:
				'b02cd384aae38021bc025522aca7a015b64ff1ac2e47426b5bc749951273fdbc81d0db4fba38f3ce334e6c0f3192dd62366f43daa46a94bfc55ebf6205ea2453',
			publicKey: '81d0db4fba38f3ce334e6c0f3192dd62366f43daa46a94bfc55ebf6205ea2453',
			binaryAddress: '4762070a641cf689f765d43ad792e1970e6bb863',
			address: 'kly3hyz7vtpcts3thsmduh98pwxrjnbw7ccoxchxu',
		};

		it('should throw error for invalid address', () => {
			expect(getAddressFromKlayr32Address.bind(null, 'invalid')).toThrow();
		});

		it('should throw error for invalid prefix', () => {
			expect(() =>
				getAddressFromKlayr32Address('abcvtr2zq9v36vyefjdvhxas92nf438z9ap8wnzav').toString('hex'),
			).toThrow(
				`Invalid address prefix. Actual prefix: abc, Expected prefix: ${DEFAULT_KLAYR32_ADDRESS_PREFIX}`,
			);
		});

		it('should return an address given a klayr32 address with default prefix', () => {
			expect(getAddressFromKlayr32Address(account.address).toString('hex')).toBe(
				account.binaryAddress,
			);
		});

		it('should return an address given a klayr32 address with custom prefix', () => {
			expect(
				getAddressFromKlayr32Address('abcvtr2zq9v36vyefjdvhxas92nf438z9ap8wnzav', 'abc').toString(
					'hex',
				),
			).toBe('14e58055a242851b7b9a17439db707f250f03724');
		});
	});

	describe('getKlayr32AddressFromAddress', () => {
		const account = {
			passphrase:
				'boil typical oyster traffic ethics timber envelope undo lecture poverty space keep',
			privateKey:
				'b02cd384aae38021bc025522aca7a015b64ff1ac2e47426b5bc749951273fdbc81d0db4fba38f3ce334e6c0f3192dd62366f43daa46a94bfc55ebf6205ea2453',
			publicKey: '81d0db4fba38f3ce334e6c0f3192dd62366f43daa46a94bfc55ebf6205ea2453',
			binaryAddress: '4762070a641cf689f765d43ad792e1970e6bb863',
			address: 'kly3hyz7vtpcts3thsmduh98pwxrjnbw7ccoxchxu',
		};

		it('should return klayr32 address given an address', () => {
			expect(getKlayr32AddressFromAddress(Buffer.from(account.binaryAddress, 'hex'))).toBe(
				account.address,
			);
		});
	});
});
