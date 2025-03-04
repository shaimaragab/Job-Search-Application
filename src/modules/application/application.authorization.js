import { roleTypes } from "../../DB/models/User.model.js"

export const endPoints = {
    addApplication:[roleTypes.user],
    getApplicationsOfJob:[roleTypes.user],
    acceptOrRejectApplication:[roleTypes.user]

    
}