import {
    getProject
} from "../config";

const validateProject = (projectName: string) => {
    const projectConfig = getProject(projectName)

    const requiredValues = [
        !projectConfig.hasOwnProperty("token") || "token",
        !projectConfig.hasOwnProperty("dateTimeCreated") || "dateTimeCreated",
        !projectConfig.hasOwnProperty("dateTimeEdited") || "dateTimeEdited",
        !projectConfig.hasOwnProperty("portIn") || "portIn",
        !projectConfig.hasOwnProperty("portOut") || "portOut"
    ].filter(Boolean);

    if (requiredValues.length > 0) {
        console.red(`Project Missing ${requiredValues.join(", ")} Required Values!`)
        return false
    }

    return true
}

export default validateProject;