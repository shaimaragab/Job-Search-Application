import { roleTypes } from "../../DB/models/User.model.js";


export const endPoint = {
    profile:Object.values(roleTypes),
    banOrUnbanUserAccount:[roleTypes.admin],
    banOrUnbanCompany:[roleTypes.admin],
    approveCompany:[roleTypes.admin],
    updateUserAccount:[roleTypes.user],
    dashboard:[roleTypes.admin],
    changePrivileges:[roleTypes.admin]
    
};