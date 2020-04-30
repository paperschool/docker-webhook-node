import {
    getProjectToken,
    projectExists,
    getTimeout,
    getProjectLastEdited
} from "../config";

const validate = (projectName: string, token: string, body: any): boolean => {

    if (!validateParams(projectName, token)) return false;
    if (!validateBody(body)) return false;
    if (!projectExists(projectName)) {
        console.red(`Project ${projectName} Does Not Exist...`);
        return false
    };
    if (!validateToken(projectName, token)) return false;
    if (!checkTimeout(projectName)) return false;

    return true;
}

export const checkTimeout = (projectName: string): boolean => {
    const projectLastEdited = getProjectLastEdited(projectName);
    const restartTimeout = getTimeout();

    if ((Date.now() - projectLastEdited) < restartTimeout) {
        console.yellow("Last change within cool down period!")
        return false;
    }

    return true;
}

export const validateToken = (projectName: string, token: string): boolean => {
    if (token !== getProjectToken(projectName)) {
        console.red(`Token Mismatch for Project: ${projectName}`)
        return false;
    }
    return true;
}

export const validateParams = (projectName: string, token: string): boolean => {
    if (!projectName) {
        console.red("Missing Project Name")
        return false;
    }

    if (!token) {
        console.red("Missing Token")
        return false;
    }

    return true;
}

export const validateBody = (body: any): boolean => {

    if (!body) {
        console.red('Missing Body Object!');
        return false;
    }

    if (!body.hasOwnProperty('repository')) {
        console.red('Body missing repository object!');
        return false;
    }

    if (!body.repository.hasOwnProperty('name')) {
        console.red('Repository missing name property!');
        return false;
    }

    if (!body.repository.hasOwnProperty('repo_name')) {
        console.red('Repository missing repo_name property!');
        return false;
    }

    if (!body.hasOwnProperty('callback_url')) {
        console.red('Repository missing callback url property!');
        return false;
    }

    return true;
}

export default validate;