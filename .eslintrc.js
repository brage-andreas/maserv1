module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	rules: {
		"brace-style": ["error", "stroustrup", { allowSingleLine: true }],
		"comma-dangle": ["error", "never"],
		"comma-spacing": "error",
		"comma-style": ["error", "last"],
		curly: ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		indent: ["error", "tab"],
		"max-nested-callbacks": ["error", { max: 4 }],
		"max-statements-per-line": ["error", { max: 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
		"no-shadow": ["error", { allow: ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": [
			"error",
			{
				anonymous: "never",
				named: "never",
				asyncArrow: "always"
			}
		],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		yoda: "error"
	}
};
