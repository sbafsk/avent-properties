import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'
import { NextRequest } from 'next/server'

const server = new ApolloServer<{ token?: string }>({
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

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
	context: async (req) => {
		// Get the authorization header
		const authHeader = req.headers.get('authorization')
		const token = authHeader?.replace('Bearer ', '')

		return {
			req,
			token,
		}
	},
})

export async function GET(request: NextRequest) {
	return handler(request)
}

export async function POST(request: NextRequest) {
	return handler(request)
}
