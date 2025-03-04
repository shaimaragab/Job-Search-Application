import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

import { roleTypes, userModel } from"../../../../DB/models/User.model.js"
import { tokenTypes } from "../../../../utils/security/token.security.js"
import { authentication } from "../../../../middleware/authentication.graphql.middleware.js"
import { companyListType } from "../types/company.type.js"
import { companyModel } from "../../../../DB/models/company.model.js"


export const companyList={
    type:new GraphQLObjectType({
        name:"companyListResponse",
        fields:{
            message:{type:GraphQLString},
            status:{type:GraphQLInt},
            data:{type:companyListType}
        }
    }),
    args:{authorization:{type:new GraphQLNonNull(GraphQLString)}},  
    resolve:async(parent,args)=>{ 
        //authentication
        const user=await authentication({authorization:args.authorization,tokenType:tokenTypes.access}) 
        console.log(user.role);
        //authorization
        let accessRoles=[roleTypes.admin]
        console.log(user.role);
        
        if (!accessRoles.includes(user.role)) { 
            throw new Error(" you are not authorized!")
        }
         
        const companies=await companyModel.find()
        return {message:"success",status:200,data:companies}
    }
}