module.exports = {
	presets: [
		[
			"@babel/env",
            {
                modules: false,
            }
		],
	],
	plugins: [
		"@babel/plugin-proposal-function-bind",
		"@babel/plugin-proposal-optional-chaining",
	],
	env: {
		test: {
			plugins: ["@babel/plugin-transform-runtime"],
			presets: [
				[
					"@babel/env",
					{
						targets: {
							node: true,
						},
					},
				],
			],
		},
	}
};
