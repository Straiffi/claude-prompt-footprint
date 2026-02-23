import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // ref-sync in render body is an intentional pattern in this codebase
            'react-hooks/refs': 'off',

            // CLAUDE.md: Use `type` instead of `interface`
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // CLAUDE.md: Use arrow functions, not function declarations
            'func-style': ['error', 'expression'],
            'prefer-arrow-callback': 'error',

            // CLAUDE.md: Always wrap if/return/else in braces
            curly: ['error', 'all'],

            // CLAUDE.md: Never use `React` as a namespace — import named exports
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'react',
                            importNames: ['default'],
                            message: 'Import individual functions/types instead of the React default export.',
                        },
                    ],
                },
            ],

            // Prefer `import type` for type-only imports
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

            // Catch unused variables (allow _ prefix)
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

            // Allow console.warn/error but flag console.log in client code
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    // Server code: allow all console methods
    {
        files: ['src/server/**/*.ts', 'src/example-mcp-app/server/**/*.ts'],
        rules: {
            'no-console': 'off',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    }
)
