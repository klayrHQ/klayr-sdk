module.exports = {
	root: true,
	extends: ['klayr-base/ts'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	rules: {
		'@typescript-eslint/member-ordering': 'off',
	},
};
