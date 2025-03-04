import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { genderTypes, providerTypes, roleTypes, userModel } from "../../../../DB/models/User.model.js";
export const imageType=new GraphQLObjectType({
    name:"pictureType",
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    }
})
export const userType=new GraphQLObjectType({
    name:"usertype",
    fields:{
        _id:{type:GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        userName:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        DOB:{type:GraphQLString},
        gender:{type:new GraphQLEnumType({
            name:"genderType",
            values: {
                male: { value: genderTypes.male },
                female: { value: genderTypes.female },
              },
        }
            
        )},
        provider:{type:new GraphQLEnumType({
            name:"providerType",
            values: {
                system: { value: providerTypes.system },
                google: { value: providerTypes.google },
            }})},
        role:{type:new GraphQLEnumType({
            name:"roleType",
            values: {
                user: { value: roleTypes.user },
                admin: { value: roleTypes.admin },
            }
        })},
        isConfirmed:{type: GraphQLBoolean},
        deletedAt: { type: GraphQLString},
        bannedAt: { type: GraphQLString},
        updatedBy: { type: GraphQLID },
        changeCredentialsTime: { type: GraphQLString},
        profilePic:{type:imageType},
        coverPic:{type:imageType},
    }
})
export const userListType=new GraphQLList(userType)