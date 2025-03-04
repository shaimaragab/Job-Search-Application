import { get } from "mongoose"
import { roleTypes } from "../../DB/models/User.model.js"


export const endPoints = {
    addCompany:[roleTypes.user,roleTypes.admin],
    updateCompany:[roleTypes.user],
    freezeCompany:[roleTypes.admin,roleTypes.user],
    getCompany:[roleTypes.user],
    getCompanyByName:[roleTypes.user],
    getApplicationsOfCompany:[roleTypes.user],
    updateLogo:[roleTypes.user],
    updateCover:[roleTypes.user],
    deleteLogo:[roleTypes.user],
    deleteCover:[roleTypes.user],
}