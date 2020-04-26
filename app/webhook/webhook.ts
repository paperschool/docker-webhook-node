import validate from "./validate";
import fetch from "node-fetch";
import {
    getCredentials,
    getProject,
    resetProjectTimeout,
    updateProjectSha
} from "../config";
import {
    login,
    pull,
    stop,
    remove,
    run
} from "../docker";

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

const execute = async (projectName: string, webhookRequestBody: any): Promise<any> => {

    const { username, password } = getCredentials();

    const dockerRepoName = webhookRequestBody.repository.repo_name

    if (!await login(username, password)) {
        console.red("Docker Login Failed...")
        return false;
    }
    console.green("Docker Logged In Successfully!")


    if (!await pull(dockerRepoName)) {
        console.red(`Docker Image ${dockerRepoName} Failed to Pull...`)
        return false;
    }
    console.green("Docker Image Pulled Successfully!")


    if (!await stop(projectName)) {
        console.red(`Docker Image ${projectName} Failed to stop...`)
    } else {
        console.green("Exiting Docker Image Stopped Successfully!")
    }


    if (!await remove(projectName)) {
        console.red(`Docker Image ${projectName} Failed to remove...`)
    } else {
        console.green("Exiting Docker Image Removed Successfully!")
    }

    const callbackUrl = webhookRequestBody.callback_url;
    const { portIn, portOut } = getProject(projectName);

    try {
        const { stdout }: any = await run(projectName, dockerRepoName, portIn, portOut)
        resetProjectTimeout(projectName);
        updateProjectSha(projectName, stdout);
        respondToHook(callbackUrl, projectName);
        console.green("Docker Image Started Successfully")
        return true;
    } catch (e) {
        console.red(e)
        console.red("Docker Image Failed To Start...")
        return false;
    }
}

export default webhook 