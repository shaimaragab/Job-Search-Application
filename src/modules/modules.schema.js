import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as userQueryResolver from './user/graphql/resolver/user.query.resolver.js'
import * as companyQueryResolver from "./company/graphql/resolver/company.query.resolver.js"

export const schema= new GraphQLSchema({
    query: new GraphQLObjectType({
            name:"mainSchemaQuery",
            description:"main schema query include all endpoints",
            fields:{
                ...userQueryResolver,
                ...companyQueryResolver
            }
        }),
    // mutation: new GraphQLObjectType({
    //     name:"mainSchemaMutation",
    //     description:"main schema mutation include all endpoints",
    //     fields:{
           
            
    //     }
    // }),
        
})