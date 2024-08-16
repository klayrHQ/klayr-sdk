const os = require('os');
const path = require('path');
const num = 10;

const followers = new Array(num).fill(0).map((_, i) => ({
	name: `follower_${i}`,
	script: './bin/run',
	args: 'start --api-http --api-ws',
	interpreter: 'node',
	env: {
		KLAYR_LOG_LEVEL: 'debug',
		KLAYR_NETWORK: 'alphanet',
		KLAYR_PORT: 7667 + i + 1,
		KLAYR_API_WS_PORT: 7887 + i + 1,
		KLAYR_SEED_PEERS: `127.0.0.1:7667`,
		KLAYR_DATA_PATH: path.join(os.homedir(), '.klayr', 'ex-pos-mainchain', `follower_${i}`),
	},
}));

module.exports = {
	apps: [
		{
			name: 'seed',
			script: './bin/run',
			args: 'start --api-http --api-ws',
			interpreter: 'node',
			env: {
				KLAYR_LOG_LEVEL: 'debug',
				KLAYR_NETWORK: 'default',
				KLAYR_DATA_PATH: path.join(os.homedir(), '.klayr', 'ex-pos-mainchain', 'seed'),
			},
		},
		...followers,
	],
};
