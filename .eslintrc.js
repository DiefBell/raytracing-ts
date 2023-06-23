/** @type {import("eslint").Linter.Config} */
module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2022,
		sourceType: "module",
		project: ["./tsconfig.json"]
	},
	plugins: [
		"@typescript-eslint",
	],
    extends: [
		"eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "prefer-const": "warn",
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-function": "off",
		"brace-style": "off",
		"@typescript-eslint/brace-style": [ "error", "allman", { "allowSingleLine": true } ],
		"semi": "error",
		"eol-last": "error",
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports"
			}
		],
		"@typescript-eslint/type-annotation-spacing": [ "error", { before: true, after: true }]
    }
};
