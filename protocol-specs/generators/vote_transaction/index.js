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

const { ed, legacy } = require('@klayr/cryptography');
const { Codec } = require('@klayr/codec');
const BaseGenerator = require('../base_generator');
const { baseTransactionSchema } = require('../../utils/schema');

const codec = new Codec();
const TAG_TRANSACTION = Buffer.from('KLY_TX_', 'utf8');
const chainID = Buffer.from('10000000', 'hex');

const senderAccount = {
	passphrase: 'lava toe nuclear candy erode present guilt develop include type pluck current',
	publicKey: Buffer.from('8c3d81b1555fbe4692adfa1026ee21c043633b9369924cf2790e2e0fc6b47a66', 'hex'),
	address: Buffer.from('67aeac2f0dcaae0b7790777a3b4ba296c427dbeb', 'hex'),
};
const validatorAccounts = [
	{
		passphrase: 'vivid phrase noble marble puzzle result pony dream loud deliver catch liquid',
		publicKey: Buffer.from(
			'5430e775505b3145c124d15dc7c84ca7c751ecb69faf653bfb1e0c91e6e22f8a',
			'hex',
		),
		address: Buffer.from('c84662196cbad0b3c84aca61b68edfaf9b89a9cb', 'hex'),
	},
	{
		passphrase: 'lonely good salon icon easy awkward cart tape vanish flee cattle spin',
		publicKey: Buffer.from(
			'73a56ce40aa991293250d9bd61471d19111f023cf1827c9be189deed733f9ea2',
			'hex',
		),
		address: Buffer.from('e6d83335c43bf404878d70e0e2f09b5ce8dd3ad5', 'hex'),
	},
	{
		passphrase: 'wall stuff hand climb know earn mix type tragic doctor abandon bamboo',
		publicKey: Buffer.from(
			'88d1d4e94f2466fe69770a510dc8e6c638875b71e96c02b4791ccc032a2a6472',
			'hex',
		),
		address: Buffer.from('744c955213a8a068fd37f871414f594aa8ce456e', 'hex'),
	},
	{
		passphrase: 'since feel friend season leaf thunder garage learn clump negative zone actress',
		publicKey: Buffer.from(
			'41583c71f266a84200f0bfdee9b3bb984f6d67f3c903ba7288c97f1259bf8ddc',
			'hex',
		),
		address: Buffer.from('45e24d0fb8627bd173a6237805faa7a1a93a9a68', 'hex'),
	},
	{
		passphrase: 'pilot payment morning average bread crucial voice donor exchange egg until elite',
		publicKey: Buffer.from(
			'5158379dc110c7fc011cfaf52466016668aecc65e5bfa79c2958e16da30490bd',
			'hex',
		),
		address: Buffer.from('142c22d041900e520769e94680a45de84ab1ed5a', 'hex'),
	},
	{
		passphrase: 'tuna tide child strategy message snap purpose vibrant erode deputy damage shed',
		publicKey: Buffer.from(
			'7cae1f08e4a4a437cffec509951ed1f30451415fff725adaa46a6d8946e95787',
			'hex',
		),
		address: Buffer.from('618cf5609802c6fafdde76ddbbc6a5d625b8995a', 'hex'),
	},
	{
		passphrase: 'pet later deliver cave weekend shell nerve basket barely tip awful fine',
		publicKey: Buffer.from(
			'f7b9ea443bdc180cd4116e2a86e302639b4b41659d818d5011bfff0642453c3a',
			'hex',
		),
		address: Buffer.from('10bc49c9226d86327306ed2aac01ebe505c62ca8', 'hex'),
	},
	{
		passphrase: 'episode topic dance ice garbage admit myself wage slim echo owner rifle',
		publicKey: Buffer.from(
			'53efe2e1b66ea35a356e07f99dbfd79965e94e78b3b80087485e38f25ff80b74',
			'hex',
		),
		address: Buffer.from('6917ad5e63dc296fed61069171a5147048c815b3', 'hex'),
	},
	{
		passphrase: 'enlist garlic noodle green agent upon video hurry donate spy denial dismiss',
		publicKey: Buffer.from(
			'4338f8c8417f96f315698ec670e8e9c35caa0830181f5554f618ba8829d436f0',
			'hex',
		),
		address: Buffer.from('9dc7b1704675d2844629de2318e28950f16f99d9', 'hex'),
	},
	{
		passphrase: 'ignore field evidence imitate hood frame hip poverty enrich frozen gossip aspect',
		publicKey: Buffer.from(
			'ca8125b3a12a2f8ad47a6d514b00c360766df5785d57203748fb8c63092020fa',
			'hex',
		),
		address: Buffer.from('48f9975c33d46498a60dd94fa54fd85326cbe0dd', 'hex'),
	},
	{
		passphrase:
			'lawsuit network mushroom chair call honey core glance acoustic define screen tomorrow',
		publicKey: Buffer.from(
			'27b7f01611f9588a2bf43774b9b890cedbdef695f1b844c815873f2fecf1e29e',
			'hex',
		),
		address: Buffer.from('d860d66d0b02ec56ed73b0d29c4740c08ed09e66', 'hex'),
	},
	{
		passphrase: 'creek rely million boss share endless sell hungry lawn hurt jungle crater',
		publicKey: Buffer.from(
			'6ff4c2b7df013316616b6b6b67ed102894184a4efcee365fd1b459e4d070cca0',
			'hex',
		),
		address: Buffer.from('86d5a271d445ff82fb8806342544da94fc3b7a23', 'hex'),
	},
	{
		passphrase: 'shield almost dinner rebel rotate nut harvest candy battle fix pass nut',
		publicKey: Buffer.from(
			'e1f20a8b1c64193db5f009fd4d88fde9bd1320b8c921fafe800bacd94c347a2b',
			'hex',
		),
		address: Buffer.from('ffaeff6c3efd06d35c3757969b340136e598efff', 'hex'),
	},
	{
		passphrase: 'lounge basket time economy lounge destroy organ dynamic save auction loud secret',
		publicKey: Buffer.from(
			'1eb301328a5681a4d3a002c892644efcc057436985d48d55261133dae0af5c41',
			'hex',
		),
		address: Buffer.from('25351f97b411688d39b278f47b071f72f300c495', 'hex'),
	},
	{
		passphrase: 'entire jungle toilet remain zoo spread combine eternal rug wish display infant',
		publicKey: Buffer.from(
			'0355085d4d6cc2565c69a248846e9d1cb7af023f8d3a2b31445a0386a45758a4',
			'hex',
		),
		address: Buffer.from('3b071492180ba5d9846466a5cce2bdda07e2cb93', 'hex'),
	},
	{
		passphrase: 'upset ivory pigeon dash theory lonely arch flock wrap adapt enable runway',
		publicKey: Buffer.from(
			'f740f22ff4413757457cd25b390f5312b5b10dd09f4ed901848a57cb84bc1261',
			'hex',
		),
		address: Buffer.from('1b40b7382ba2e03ddea7cbfb41f930bb20a0a43a', 'hex'),
	},
	{
		passphrase: 'search wild flavor suit culture alcohol energy rate glad trophy angle promote',
		publicKey: Buffer.from(
			'09bf0bd593f354f7949cbbf42cedfdc9fabd2d7da5ff24e0f24c4017ebdb7450',
			'hex',
		),
		address: Buffer.from('32ae25c43d2d518dcc634240542de7111577de6b', 'hex'),
	},
	{
		passphrase:
			'quality sniff spice melody royal wide industry parent antique animal inquiry economy',
		publicKey: Buffer.from(
			'2998ae5c6b28388fd654262ca19a4d669abf067aa2a28fa2ecb94079d1386ec9',
			'hex',
		),
		address: Buffer.from('15df6e79322112e16eee5e64fc72563321924895', 'hex'),
	},
	{
		passphrase: 'find alcohol buzz emotion holiday forest problem age multiply sadness hen fashion',
		publicKey: Buffer.from(
			'f8b282fe76bed11e0048f668e2768f1b5346acd77b3afe2a01c9b3874612fba2',
			'hex',
		),
		address: Buffer.from('9b74ce83452582adcafc04d6dbe55f590163c602', 'hex'),
	},
	{
		passphrase: 'purse erase first gallery drama horror gloom abandon cupboard pill twist bitter',
		publicKey: Buffer.from(
			'19528c41f749fb0acd840b5349823afea8d96d9380cf4c674a5cf522417a6946',
			'hex',
		),
		address: Buffer.from('0ebb31723a0d437ec1fc4c2d1631c664684a5ff1', 'hex'),
	},
];

const assetSchema = {
	$id: '/protocolSpec/assets/stake',
	type: 'object',
	properties: {
		stakes: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					validatorAddress: { dataType: 'bytes', fieldNumber: 1 },
					amount: { dataType: 'sint64', fieldNumber: 2 },
				},
				required: ['validatorAddress', 'amount'],
			},
			fieldNumber: 1,
		},
	},
	required: ['stakes'],
};

const getAssetBytes = asset => codec.encode(assetSchema, asset);

const getSignBytes = tx => {
	const assetBytes = getAssetBytes(tx.asset);
	const signingTx = {
		...tx,
		asset: assetBytes,
		signatures: [],
	};
	return codec.encode(baseTransactionSchema, signingTx);
};

const encode = tx => {
	const assetBytes = getAssetBytes(tx.asset);
	const txWithAssetBytes = {
		...tx,
		asset: assetBytes,
	};
	return codec.encode(baseTransactionSchema, txWithAssetBytes);
};

const generateValidUpstakeTransaction = () => {
	const unsignedTransaction = {
		moduleID: 5,
		assetID: 1,
		fee: BigInt('1500000000'),
		nonce: BigInt('1'),
		senderPublicKey: senderAccount.publicKey,
		asset: {
			stakes: [
				{
					validatorAddress: validatorAccounts[0].address,
					amount: BigInt('1000000000'),
				},
				{
					validatorAddress: validatorAccounts[1].address,
					amount: BigInt('50000000000'),
				},
				{
					validatorAddress: validatorAccounts[2].address,
					amount: BigInt('320000000000'),
				},
				{
					validatorAddress: validatorAccounts[3].address,
					amount: BigInt('420000000000'),
				},
				{
					validatorAddress: validatorAccounts[4].address,
					amount: BigInt('520000000000'),
				},
				{
					validatorAddress: validatorAccounts[5].address,
					amount: BigInt('620000000000'),
				},
				{
					validatorAddress: validatorAccounts[6].address,
					amount: BigInt('820000000000'),
				},
				{
					validatorAddress: validatorAccounts[7].address,
					amount: BigInt('920000000000'),
				},
				{
					validatorAddress: validatorAccounts[8].address,
					amount: BigInt('140000000000'),
				},
				{
					validatorAddress: validatorAccounts[9].address,
					amount: BigInt('130000000000'),
				},
			],
		},
	};
	const signBytes = getSignBytes(unsignedTransaction);
	const signature = ed.signData(
		TAG_TRANSACTION,
		chainID,
		signBytes,
		legacy.getPrivateAndPublicKeyFromPassphrase(senderAccount.passphrase).privateKey,
	);
	const encodedTx = encode({ ...unsignedTransaction, signatures: [signature] });

	return {
		description: 'Valid upvote case',
		input: {
			account: {
				...senderAccount,
				address: senderAccount.address,
				publicKey: senderAccount.publicKey,
			},
			chainID,
			validators: validatorAccounts.map(d => ({
				...d,
				address: d.address,
				publicKey: d.publicKey,
			})),
		},
		output: {
			transaction: encodedTx,
		},
	};
};

const generateValidDownstakeTransaction = () => {
	const unsignedTransaction = {
		type: 13,
		fee: BigInt('1500000000'),
		nonce: BigInt('2'),
		senderPublicKey: senderAccount.publicKey,
		asset: {
			stakes: [
				{
					validatorAddress: validatorAccounts[0].address,
					amount: BigInt('-10000000000000'),
				},
				{
					validatorAddress: validatorAccounts[1].address,
					amount: BigInt('-20030000000000'),
				},
				{
					validatorAddress: validatorAccounts[2].address,
					amount: BigInt('-30030000000000'),
				},
				{
					validatorAddress: validatorAccounts[3].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[4].address,
					amount: BigInt('-50200000000000'),
				},
				{
					validatorAddress: validatorAccounts[5].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[6].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[7].address,
					amount: BigInt('-50000000000000'),
				},
				{
					validatorAddress: validatorAccounts[8].address,
					amount: BigInt('-50000000000000'),
				},
				{
					validatorAddress: validatorAccounts[9].address,
					amount: BigInt('-10000000000000'),
				},
			],
		},
	};

	const signBytes = getSignBytes(unsignedTransaction);
	const signature = ed.signData(
		TAG_TRANSACTION,
		chainID,
		signBytes,
		legacy.getPrivateAndPublicKeyFromPassphrase(senderAccount.passphrase).privateKey,
	);
	const encodedTx = encode({ ...unsignedTransaction, signatures: [signature] });

	return {
		description: 'Valid downvote case',
		input: {
			account: {
				...senderAccount,
				address: senderAccount.address,
				publicKey: senderAccount.publicKey,
			},
			chainID,
			validators: validatorAccounts.map(d => ({
				...d,
				address: d.address,
				publicKey: d.publicKey,
			})),
		},
		output: {
			transaction: encodedTx,
		},
	};
};

const generateValidUpstakeAndDownstakeVoteTransaction = () => {
	const unsignedTransaction = {
		type: 13,
		fee: BigInt('1500000000'),
		nonce: BigInt('2'),
		senderPublicKey: senderAccount.publicKey,
		asset: {
			stakes: [
				{
					validatorAddress: validatorAccounts[0].address,
					amount: BigInt('-10000000000000'),
				},
				{
					validatorAddress: validatorAccounts[1].address,
					amount: BigInt('1000000000'),
				},
				{
					validatorAddress: validatorAccounts[2].address,
					amount: BigInt('140000000000'),
				},
				{
					validatorAddress: validatorAccounts[3].address,
					amount: BigInt('-20030000000000'),
				},
				{
					validatorAddress: validatorAccounts[4].address,
					amount: BigInt('-30030000000000'),
				},
				{
					validatorAddress: validatorAccounts[5].address,
					amount: BigInt('50000000000'),
				},
				{
					validatorAddress: validatorAccounts[6].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[7].address,
					amount: BigInt('-50200000000000'),
				},
				{
					validatorAddress: validatorAccounts[8].address,
					amount: BigInt('520000000000'),
				},
				{
					validatorAddress: validatorAccounts[9].address,
					amount: BigInt('420000000000'),
				},
				{
					validatorAddress: validatorAccounts[10].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[11].address,
					amount: BigInt('-40030000000000'),
				},
				{
					validatorAddress: validatorAccounts[12].address,
					amount: BigInt('920000000000'),
				},
				{
					validatorAddress: validatorAccounts[13].address,
					amount: BigInt('-50000000000000'),
				},
				{
					validatorAddress: validatorAccounts[14].address,
					amount: BigInt('620000000000'),
				},
				{
					validatorAddress: validatorAccounts[15].address,
					amount: BigInt('-50000000000000'),
				},
				{
					validatorAddress: validatorAccounts[16].address,
					amount: BigInt('320000000000'),
				},
				{
					validatorAddress: validatorAccounts[17].address,
					amount: BigInt('820000000000'),
				},
				{
					validatorAddress: validatorAccounts[18].address,
					amount: BigInt('130000000000'),
				},
				{
					validatorAddress: validatorAccounts[19].address,
					amount: BigInt('-50000000000000'),
				},
			],
		},
	};

	const signBytes = getSignBytes(unsignedTransaction);
	const signature = ed.signData(
		TAG_TRANSACTION,
		chainID,
		signBytes,
		legacy.getPrivateAndPublicKeyFromPassphrase(senderAccount.passphrase).privateKey,
	);
	const encodedTx = encode({ ...unsignedTransaction, signatures: [signature] });

	return {
		description: 'Valid mixture of upvote and downvote case',
		input: {
			account: {
				...senderAccount,
				address: senderAccount.address,
				publicKey: senderAccount.publicKey,
			},
			chainID,
			validators: validatorAccounts.map(d => ({
				...d,
				address: d.address,
				publicKey: d.publicKey,
			})),
		},
		output: {
			transaction: encodedTx,
		},
	};
};

const validUpstakeSuite = () => ({
	title: 'Valid stake transaction',
	summary: 'Cases of valid stake transaction with upvote, downvote and mixture of both',
	config: {
		network: 'devnet',
	},
	runner: 'vote_transaction',
	handler: 'vote_transaction_10_upvotes',
	testCases: [
		generateValidUpstakeTransaction(),
		generateValidDownstakeTransaction(),
		generateValidUpstakeAndDownstakeVoteTransaction(),
	],
});

module.exports = BaseGenerator.runGenerator('vote_transaction', [validUpstakeSuite]);
