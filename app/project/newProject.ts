import saveProject from "./saveProject";

import { ProjectConfiguration } from "../commands/project/configureProject";

import {
    projectExists,
} from "../config";

const newProject = (projectConfiguration: ProjectConfiguration): boolean => {

    if (projectExists(projectConfiguration.projectName)) {
        console.red(`Project ${projectConfiguration.projectName} Already Exists...`);
        return false;
    }

    if (projectConfiguration.dependencies.length !== 0 && projectConfiguration.networkName === "") {
        console.red(`Project ${projectConfiguration.projectName} Requires Network Name if Using Dependencies...`);
        return false;
    }

    return saveProject(projectConfiguration)
}

export default newProject;