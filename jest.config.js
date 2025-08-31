const nextJest = require('next/jest')

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files
	dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	// Suppress console warnings for act() in tests
	silent: false,
	verbose: false,

	collectCoverageFrom: [
		'app/**/*.{js,jsx,ts,tsx}',
		'components/**/*.{js,jsx,ts,tsx}',
		'lib/**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	testMatch: [
		'<rootDir>/**/__tests__/**/*.(test|spec).{js,jsx,ts,tsx}',
		'<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
	],
	testPathIgnorePatterns: [
		'<rootDir>/__tests__/setup.ts',
		'<rootDir>/__tests__/types.d.ts',
	],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
