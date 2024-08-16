/*
 * Copyright © 2020 Lisk Foundation
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

'use strict';

const BaseGenerator = require('../base_generator');
const {
	validNumberEncodingsTestCases,
	validNumberDecodingsTestCases,
	validBooleanEncodingsTestCases,
	validBooleanDecodingsTestCases,
	validStringsEncodingTestCases,
	validStringsDecodingTestCases,
	validBytesEncodingsTestCases,
	validBytesDecodingsTestCases,
	validObjectEncodingsTestCases,
	validObjectDecodingsTestCases,
	validArrayEncodingsTestCases,
	validArrayDecodingsTestCases,
	validBlockEncodingsTestCases,
	validBlockDecodingsTestCases,
	validGenesisBlockAssetEncodingsTestCases,
	validGenesisBlockAssetDecodingsTestCases,
	validBlockHeaderEncodingsTestCases,
	validBlockHeaderDecodingsTestCases,
	validBlockAssetEncodingsTestCases,
	validBlockAssetDecodingsTestCases,
	validAccountEncodingTestCases,
	validAccountDecodingTestCases,
	validTransactionEncodingsTestCases,
	validTransactionDecodingsTestCases,
	cartSampleEncodingsTestCases,
	cartSampleDecodingsTestCases,
	validPeerInfoEncodingsTestCases,
	validPeerInfoDecodingsTestCases,
	validNestedArrayEncodingsTestCases,
	validNestedArrayDecodingsTestCases,
} = require('./types_generators');

const generateTestSuite = (data, handler, encodingTestCases, decodingTestCases) => [
	() => ({
		...data,
		title: `Encoding ${data.title}`,
		config: {
			network: 'devnet',
		},
		runner: 'klayr_codec',
		handler: `${handler}_encodings`,
		testCases: encodingTestCases,
	}),
	() => ({
		...data,
		title: `Decoding ${data.title}`,
		config: {
			network: 'devnet',
		},
		runner: 'klayr_codec',
		handler: `${handler}_decodings`,
		testCases: decodingTestCases,
	}),
];

module.exports = BaseGenerator.runGenerator('klayr_codec', [
	...generateTestSuite(
		{
			title: 'for number types supported by klayr-codec',
			summary: 'Examples of encoding numbers with klayr-codec',
		},
		'number',
		validNumberEncodingsTestCases,
		validNumberDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for boolean types supported by klayr-codec',
			summary: 'Examples of encoding booleans with klayr-codec',
		},
		'boolean',
		validBooleanEncodingsTestCases,
		validBooleanDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for string types supported by klayr-codec',
			summary: 'Examples of encoding strings with klayr-codec',
		},
		'string',
		validStringsEncodingTestCases,
		validStringsDecodingTestCases,
	),
	...generateTestSuite(
		{
			title: 'for bytes types supported by klayr-codec',
			summary: 'Examples of encoding bytes with klayr-codec',
		},
		'bytes',
		validBytesEncodingsTestCases,
		validBytesDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for objects types supported by klayr-codec',
			summary: 'Examples of encoding objects with klayr-codec',
		},
		'objects',
		validObjectEncodingsTestCases,
		validObjectDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for arrays types supported by klayr-codec',
			summary: 'Examples of encoding arrays with klayr-codec',
		},
		'arrays',
		validArrayEncodingsTestCases,
		validArrayDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for block types supported by klayr-codec',
			summary: 'Examples of encoding block with klayr-codec',
		},
		'block',
		validBlockEncodingsTestCases,
		validBlockDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for genesis block types supported by klayr-codec',
			summary: 'Examples of encoding block with klayr-codec',
		},
		'genesis_block',
		validGenesisBlockAssetEncodingsTestCases,
		validGenesisBlockAssetDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for block header types supported by klayr-codec',
			summary: 'Examples of encoding block header with klayr-codec',
		},
		'block_header',
		validBlockHeaderEncodingsTestCases,
		validBlockHeaderDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for block asset types supported by klayr-codec',
			summary: 'Examples of encoding block asset with klayr-codec',
		},
		'block_asset',
		validBlockAssetEncodingsTestCases,
		validBlockAssetDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for account types supported by klayr-codec',
			summary: 'Examples of encoding account with klayr-codec',
		},
		'account',
		validAccountEncodingTestCases,
		validAccountDecodingTestCases,
	),
	...generateTestSuite(
		{
			title: 'for transaction types supported by klayr-codec',
			summary: 'Examples of encoding transaction with klayr-codec',
		},
		'transaction',
		validTransactionEncodingsTestCases,
		validTransactionDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for a complex object',
			summary: 'Example of encoding a complex object that might exist in custom apps',
		},
		'cart_sample',
		cartSampleEncodingsTestCases,
		cartSampleDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for a peer info object',
			summary: 'Example of encoding a peer info object for p2p',
		},
		'peer_info_sample',
		validPeerInfoEncodingsTestCases,
		validPeerInfoDecodingsTestCases,
	),
	...generateTestSuite(
		{
			title: 'for a nested array',
			summary: 'Example of encoding a nested array',
		},
		'nested_array',
		validNestedArrayEncodingsTestCases,
		validNestedArrayDecodingsTestCases,
	),
]);
