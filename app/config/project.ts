import {
    write,
    open
} from "./file"

import ProjectType from "../project/ProjectType";

export const resetProjectTimeout = (projectName: string): void => {
    const project = getProject(projectName);
    const newProject = {
        ...project,
        dateTimeEdited: Date.now()
    }
    writeProject(projectName, newProject)
}

export const setProjectSha = (projectName: string, newSha: string) => {
    const project = getProject(projectName);
    const newProject = {
        ...project,
        sha: newSha
    }
    writeProject(projectName, newProject);
}

export const getProjectLastEdited = (projectName: string): number => {
    if (projectExists(projectName)) {
        return getProject(projectName).dateTimeEdited
    };
    return 0;
}

export const getProjectToken = (projectName: string): string => {
    if (projectExists(projectName)) {
        return getProject(projectName).token
    };
    return "";
}

export const removeProject = (projectName: string) => {
    const config = open();
    const newConfig = {
        ...config
    }

    if (projectExists(projectName)) {
        delete newConfig.projects[projectName];
        write(newConfig)
        return true;
    } else {
        return false;
    }

}

export const writeProject = (projectName: string, projectData: ProjectType): boolean => {
    const config = open();

    const newConfig = {
        ...config,
        projects: {
            ...config.projects,
            [projectName]: projectData
        }
    }

    return write(newConfig)
}

export const projectExists = (projectName: string): boolean => {
    const config = open();

    return config.projects.hasOwnProperty(projectName)
}

export const getProject = (projectName: string): ProjectType => {
    const config = open();

    if (projectExists(projectName)) {
        return config.projects[projectName];
    }
}

export const getProjectNames = (): string[] => {
    const config = open();

    return Object.keys(config.projects)
}