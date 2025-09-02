import { queryResolvers } from './queries'
import { mutationResolvers } from './mutations'

export const resolvers = {
    ...queryResolvers,
    ...mutationResolvers,
}
