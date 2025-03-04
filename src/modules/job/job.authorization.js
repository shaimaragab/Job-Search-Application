import { roleTypes } from "../../DB/models/User.model.js"

export const endPoints = {
    addJob:[roleTypes.user],
    updateJob:[roleTypes.user],
    deleteJob:[roleTypes.user],
    getJobs:[roleTypes.user],
    getJobsByFilter:[roleTypes.user],
    
}