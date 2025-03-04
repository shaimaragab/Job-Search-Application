import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../../user/graphql/types/user.types.js";
export const companyType=new GraphQLObjectType({
    name:"companytype",
    fields:{
        _id:{type:GraphQLID},
        companyName:{type:GraphQLString},
        companyEmail:{type:GraphQLString},
        description:{type:GraphQLString},
        numberOfEmployees:{type:GraphQLString},
        deletedAt: { type: GraphQLString},
        bannedAt: { type: GraphQLString},
        createdBy: { type: GraphQLID },
        logo:{type:new GraphQLList(imageType)},
        coverPic:{type:new GraphQLList(imageType)},
        legalAttachment:{type:new GraphQLList(imageType)},
        HRs:{type:new GraphQLList(GraphQLID)},
        approvedByAdmin:{type:GraphQLBoolean}
    }
})
export const companyListType=new GraphQLList(companyType)