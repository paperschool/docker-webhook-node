import saveProject from "./saveProject";
import { ProjectConfiguration } from "../commands/project/configureProject";

const editProject = (
    projectConfiguration: ProjectConfiguration): boolean => {

    return saveProject(projectConfiguration)
}

export default editProject;