import fs from "fs";
import path from "path";
import {
    emptyConfig,
    credentials
} from "./generators";
import { get } from "../settings";

import ProjectType from "../project/ProjectType";

export const resetProjectTimeout = (projectName: string): void => {
    const project = getProject(projectName);
    const newProject = {
        ...project,
        dateTimeEdited: Date.now()
    }
    writeProject(projectName, newProject)
}

export const resetCredentials = (): void => {
    setCredentials("", "")
}

export const setCredentials = (username: string, password: string): void => {
    const config = open();
    const newConfig = {
        ...config,
        ...credentials(username, password)
    }
    write(newConfig)
}

export const getCredentials = (): any => {
    const config = open();
    return config.credentials;
}

export const updateTimeout = (newTimeout: number): void => {
    const config = open();
    const newConfig = {
        ...config,
        timeout: newTimeout
    }
    write(newConfig)
}

export const getTimeout = (): number => {
    return parseInt(open().timeout)
}

export const updateProjectSha = (projectName: string, newSha: string) => {
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

export const getToken = (projectName: string): string => {
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

export const writeProject = (projectName: string, projectData: ProjectType) => {
    const config = open();

    const newConfig = {
        ...config,
        projects: {
            ...config.projects,
            [projectName]: projectData
        }
    }

    write(newConfig)
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

export const establishConfig = () => {
    return true;
}

export const open = (): any => {

    if (!fs.existsSync(getConfigPath())) {
        reset()
    }
    return JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
}

export const reset = (): any => {
    console.green("Writing New Config...")
    write(emptyConfig())
}

export const write = (config: any): boolean => {
    console.log(config, getConfigPath())
    try {
        fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 4), 'ascii')
        return true;
    } catch {
        return false;
    }
}

export const getConfigPath = (): string =>
    path.join(get("configPath"), "config.json");


export const print = () => {
    console.log(JSON.stringify(open(), null, 4));
}