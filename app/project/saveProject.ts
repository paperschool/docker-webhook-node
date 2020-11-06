import ProjectType from "./ProjectType";
import generateToken from "./generateToken";
import newHookOutput from "./newHookOutput";
import {
    writeProject, getProject
} from "../config"
import { ProjectConfiguration } from "../commands/project/configureProject";


const saveProject = ({
    projectName,
    repoName,
    portIn,
    portOut,
    dependencies,
    networkName
}: ProjectConfiguration): boolean => {

    const existingProject = getProject(projectName);

    const token = generateToken();
    newHookOutput(projectName, token);

    const newProject: ProjectType = {
        repoName: repoName || existingProject.repoName,
        portIn: portIn || existingProject.portIn,
        portOut: portOut || existingProject.portOut,
        dateTimeCreated: existingProject ? existingProject.dateTimeCreated : Date.now(),
        dateTimeEdited: Date.now(),
        dependencies,
        networkName,
        token,
        sha: ""
    }

    return writeProject(projectName, newProject)
}

export default saveProject;