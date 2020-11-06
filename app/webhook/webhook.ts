import validate from "./validate";
import fetch from "node-fetch";
import {
    getCredentials,
    getProject,
    resetProjectTimeout,
    setProjectSha,
    getDependency
} from "../config";
import {
    login,
    pull,
    stop,
    remove,
    run,
    networkCreate,
    networkExists,
    networkConnect,
    isContainerRunning
} from "../docker";
import DependencyType from "../dependency/DependencyType";
import { setDependencySha } from "../config/dependency";

const webhook = async (projectName: string, token: string, body: any): Promise<boolean> => {

    const isRequestValid = await validate(projectName, token, body)

    if (isRequestValid) {
        console.green("Webhook Request Validated!")
        return await execute(projectName, body);
    } else {
        return false;
    }
}

const respondToHook = async (callbackUrl: string, projectName: string) => {
    try {
        await fetch(callbackUrl, {
            method: "post",
            body: JSON.stringify({
                state: "success",
                descritpion: `App ${projectName} Succesfully Updated.`,
                context: `Automated Hook Start for App: ${projectName}`,
                target_url: `stax.onosendai.space`
            })
        })
        return true;
    } catch (e) {
        console.red(e)
    }
}
const execute = async (projectName: string, webhookRequestBody: any): Promise<boolean> => {

    // create / establish network first    
    if (!await createNetwork(projectName)) return false;

    // start dependency containers second
    if (!await startDependencies(projectName)) return false;

    // start project container third
    if (!await startProject(projectName, webhookRequestBody)) return false;

    return true;
}

const createNetwork = async (projectName: string): Promise<boolean> => {

    const { networkName } = getProject(projectName);

    if (networkName === "") {
        console.green(`No Docker Network Specified!`);
        return true;
    }

    console.title(`${projectName} - Setting Up Network`)

    if (await networkExists(networkName)) {
        console.green(`Docker Network ${networkName} Exists!`);
        return true;
    }

    try {
        await networkCreate(networkName);
        console.green(`Docker Network ${networkName} Created!`);
        return true
    } catch (e) {
        console.red(e);
        console.red(`Docker Network ${networkName} not created...`);
        return false;
    }
}

const startDependency = async ({
    canRestart,
    dependencyName,
    dependencyRepo,
    volumeMountPath,
    sha
}: DependencyType,
    networkName: string): Promise<boolean> => {

    if (!canRestart && await isContainerRunning(sha)) {
        console.green(`Non-Restartable Dependency ${dependencyName} Already Running - Nothing To Do!`)
        return true;
    }

    if (!await pull(dependencyRepo)) {
        console.red(`Project Dependency ${dependencyRepo} Failed to Pull...`)
        return false;
    }

    if (!await stop(sha)) {
        console.red(`Project ${dependencyName} Container Failed to stop...`)
    }

    if (!await remove(sha)) {
        console.red(`Project ${dependencyName} Container Failed to remove...`)
    }

    try {
        const { stdout }: any = await run(dependencyName, dependencyRepo)
        setDependencySha(dependencyName, stdout);
        console.green(`Project Dependency ${dependencyName} as ${stdout} Started!`)
    } catch (e) {
        console.red(e)
        console.red(`Project Dependency ${dependencyRepo} Failed to Start...`)
        return false;
    }

    if (!await networkConnect(networkName, dependencyName)) {
        console.red(`Project Dependency ${dependencyRepo} Failed to Connect to Network ${networkName}...`)
        return false;
    }

    return true;
}

const startDependencies = async (projectName: string): Promise<boolean> => {

    // check for dependencies
    const { dependencies, networkName } = getProject(projectName);

    if (dependencies.length === 0) {
        console.green(`No Dependencies Required for ${projectName}!`);
        return true;
    }

    console.title(`${projectName} - Setting Up Dependencies`)

    // store associated dependency blocks
    // loop through dependency collection
    return await dependencies.reduce(async (
        dependencyStartSucccess: Promise<boolean> | boolean,
        dependencyName: string
    ) => {

        const dependency = getDependency(dependencyName);
        if (typeof dependency !== "undefined") {
            console.green(`Setting Up Dependency ${dependencyName}`)
            return dependencyStartSucccess && await startDependency(dependency, networkName)
        }

        console.red(`Dependency: ${dependencyName} in Project: ${projectName} Does Not Exist...`)
        return false
    }, true);

}

const startProject = async (projectName: string, webhookRequestBody: any): Promise<boolean> => {

    console.title(`${projectName} - Setup Project`)

    const { username, password } = getCredentials();

    const dockerRepoName = webhookRequestBody.repository.repo_name

    if (!await login(username, password)) {
        console.red("Docker Login Failed...")
        return false;
    }
    console.green("Docker Logged In Successfully!")


    if (!await pull(dockerRepoName)) {
        console.red(`Project ${dockerRepoName} Image Failed to Pull...`)
        return false;
    }
    console.green(`Project ${projectName} Image Pulled Successfully!`)

    if (!await stop(projectName)) {
        console.red(`Project ${projectName} Container Failed to stop...`)
    }
    console.green(`Project ${projectName} Container Stopped Successfully!`)

    if (!await remove(projectName)) {
        console.red(`Project ${projectName} Container Failed to remove...`)
    }
    console.green(`Project ${projectName} Removed Successfully!`)

    const callbackUrl = webhookRequestBody.callback_url;
    const { portIn, portOut, networkName } = getProject(projectName);

    try {
        const { stdout }: any = await run(projectName, dockerRepoName, portIn, portOut)
        resetProjectTimeout(projectName);
        setProjectSha(projectName, stdout);
        respondToHook(callbackUrl, projectName);
        console.green(`Project ${projectName} Started Successfully!`)
    } catch (e) {
        console.red(e)
        console.red(`Project ${projectName} Failed to start...`)
        return false;
    }

    if (networkName !== "") {
        if (!await networkConnect(networkName, projectName)) {
            console.red(`Project ${projectName} Failed to Attach to Network ${networkName}...`)
            return false;
        }
        console.green(`Project ${projectName} Attached to Network ${networkName} Successfully!`)
    }

    return true;

}

export default webhook 