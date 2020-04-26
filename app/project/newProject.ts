import ProjectType from "./ProjectType";
import newHookOutput from "./newHookOutput";
import generateToken from "./generateToken";

import {
    getProject,
    writeProject
} from "../config";

const newProject = (projectName: string, portIn: number, portOut: number): boolean => {

    if (getProject(projectName)) {
        console.red(`Project ${projectName} Already Exists...`);
        return false;
    }

    const token = generateToken();

    newHookOutput(projectName, token);

    const newProject: ProjectType = {
        portIn,
        portOut,
        dateTimeCreated: Date.now(),
        dateTimeEdited: Date.now(),
        token,
        sha: ""

    }

    writeProject(projectName, newProject)

    return true;
}

export default newProject;