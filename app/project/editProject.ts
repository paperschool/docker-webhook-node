import ProjectType from "./ProjectType";
import newHookOutput from "./newHookOutput";
import generateToken from "./generateToken";

import {
    projectExists,
    getProject,
    writeProject,
    removeProject
} from "../config";

const editProject = (existingProjectName: string, newProjectName: string, portIn?: number, portOut?: number): boolean => {

    const existingProject = getProject(existingProjectName);

    if (!projectExists(existingProjectName)) {
        console.red(`Project ${existingProjectName} Does Not Exist...`);
        return false;
    }

    const token = generateToken();

    newHookOutput(newProjectName, token);

    const newProject: ProjectType = {
        ...existingProject,
        portIn: portIn || existingProject.portIn,
        portOut: portOut || existingProject.portOut,
        dateTimeEdited: Date.now(),
        token,
        sha: ""

    }

    removeProject(existingProjectName)
    writeProject(newProjectName, newProject)

    return true;
}

export default editProject;