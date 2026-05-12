const noCallAsArgument = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow passing a function call result directly as an argument to another call.',
		},
		messages: {
			nested:
				'Pass intermediate results through a named variable instead of nesting calls. Extract `{{ inner }}` to a const before passing it in.',
		},
		schema: [],
	},
	create(context) {
		const sourceCode = context.sourceCode ?? context.getSourceCode();

		function snippet(node) {
			const text = sourceCode.getText(node);

			if (text.length <= 40) return text;

			return `${text.slice(0, 37)}...`;
		}

		return {
			CallExpression(node) {
				for (const arg of node.arguments) {
					if (arg.type === 'CallExpression' || arg.type === 'NewExpression') {
						context.report({
							node: arg,
							messageId: 'nested',
							data: { inner: snippet(arg) },
						});
					} else if (arg.type === 'SpreadElement') {
						const argument = arg.argument;

						if (argument.type === 'CallExpression' || argument.type === 'NewExpression') {
							context.report({
								node: argument,
								messageId: 'nested',
								data: { inner: snippet(argument) },
							});
						}
					}
				}
			},
		};
	},
};

const requireBlockExceptEmptyReturn = {
	meta: {
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description:
				'Require if/else bodies to be a block, except for bare `return;` or `return null;`.',
		},
		messages: {
			requireBlock:
				'Use a block (`{ ... }`) for this branch — only `return;` or `return null;` may be unbraced.',
		},
		schema: [],
	},
	create(context) {
		const sourceCode = context.sourceCode ?? context.getSourceCode();

		function isAllowedReturn(node) {
			if (node.type !== 'ReturnStatement') return false;

			const arg = node.argument;

			if (!arg) return true;

			if (arg.type === 'Literal' && arg.value === null) return true;

			if (arg.type === 'NullLiteral') return true;

			return false;
		}

		function check(branch) {
			if (!branch) return;
			if (branch.type === 'BlockStatement') return;

			if (branch.type === 'IfStatement') return;

			if (isAllowedReturn(branch)) return;

			context.report({
				node: branch,
				messageId: 'requireBlock',
				fix(fixer) {
					const text = sourceCode.getText(branch);

					return fixer.replaceText(branch, `{ ${text} }`);
				},
			});
		}

		return {
			IfStatement(node) {
				check(node.consequent);
				check(node.alternate);
			},
		};
	},
};

const noForeach = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow `.forEach()`; use a `for...of` loop instead.',
		},
		messages: {
			noForeach:
				'Avoid `.forEach()` — use a `for...of` loop. It is faster, supports `await`/`break`/`continue`, and keeps control flow visible.',
		},
		schema: [],
	},
	create(context) {
		return {
			CallExpression(node) {
				const callee = node.callee;

				if (callee.type !== 'MemberExpression') return;
				if (callee.computed) return;
				if (callee.property.type !== 'Identifier') return;
				if (callee.property.name !== 'forEach') return;

				context.report({ node: callee.property, messageId: 'noForeach' });
			},
		};
	},
};

const plugin = {
	meta: { name: 'project' },
	rules: {
		'no-call-as-argument': noCallAsArgument,
		'require-block-except-empty-return': requireBlockExceptEmptyReturn,
		'no-foreach': noForeach,
	},
};

export default plugin;
