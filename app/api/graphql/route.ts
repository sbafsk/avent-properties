import { ApolloServer } from '@apollo/server'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'
import { createContext } from '@/lib/graphql/context'
import { NextRequest } from 'next/server'

const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: (error) => {
		console.error('GraphQL Error:', error)
		return {
			message: error.message,
			extensions: {
				code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
			},
		}
	},
})

// Initialize the server
let serverStarted = false
async function ensureServerStarted() {
	if (!serverStarted) {
		await server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests()
		serverStarted = true
	}
}

export async function GET(request: NextRequest) {
	await ensureServerStarted()

	const url = new URL(request.url)
	const query = url.searchParams.get('query')
	const variables = url.searchParams.get('variables')
	const operationName = url.searchParams.get('operationName')

	if (!query) {
		return new Response('Query parameter is required', { status: 400 })
	}

	try {
		const context = await createContext({ req: request })
		const result = await server.executeOperation(
			{
				query,
				variables: variables ? JSON.parse(variables) : undefined,
				operationName: operationName || undefined,
			},
			{ contextValue: context }
		)

		return Response.json(result)
	} catch (error) {
		console.error('GraphQL execution error:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	await ensureServerStarted()

	try {
		const body = await request.json()
		const { query, variables, operationName } = body

		if (!query) {
			return new Response('Query is required in request body', { status: 400 })
		}

		const context = await createContext({ req: request })
		const result = await server.executeOperation(
			{
				query,
				variables,
				operationName,
			},
			{ contextValue: context }
		)

		return Response.json(result)
	} catch (error) {
		console.error('GraphQL execution error:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}
