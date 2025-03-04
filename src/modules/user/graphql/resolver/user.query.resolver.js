import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

import { roleTypes, userModel } from"../../../../DB/models/User.model.js"
import { tokenTypes } from "../../../../utils/security/token.security.js"
import { authentication } from "../../../../middleware/authentication.graphql.middleware.js"
import { userListType, userType } from "../types/user.types.js"


export const userList={
    type:new GraphQLObjectType({
        name:"userListResponse",
        fields:{
            message:{type:GraphQLString},
            status:{type:GraphQLInt},
            data:{type:userListType}
        }
    }),
    args:{authorization:{type:new GraphQLNonNull(GraphQLString)}},  
    resolve:async(parent,args)=>{ 
        const user=await authentication({authorization:args.authorization,tokenType:tokenTypes.access}) 
        console.log(user.role);
        //authorization
        let accessRoles=[roleTypes.admin]
        if (!accessRoles.includes(user.role)) { 
            throw new Error(" you are not authorized!")
        }
         
        const users=await userModel.find()
        return {message:"success",status:200,data:users}
    }
}