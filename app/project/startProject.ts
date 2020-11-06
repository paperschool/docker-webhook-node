import { getProject, resetProjectTimeout, setProjectSha } from "../config";
import {
    stop,
    remove,
    run,
    networkConnect
} from "../docker";

const startProject = async (projectName: string): Promise<boolean> => {

    const { repoName, portIn, portOut, networkName } = getProject(projectName);

    console.title(`${projectName} - Starting Project`)

    if (!await stop(projectName)) {
        console.red(`Project ${projectName} Container Failed to stop...`)
    }
    console.green(`Project ${projectName} Container Stopped Successfully!`)

    if (!await remove(projectName)) {
        console.red(`Project ${projectName} Container Failed to remove...`)
    }
    console.green(`Project ${projectName} Removed Successfully!`)

    const imagePullName = `${repoName}/${projectName}`;

    try {
        const { stdout }: any = await run(projectName, imagePullName, portIn, portOut)
        resetProjectTimeout(projectName);
        setProjectSha(projectName, stdout);
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

export default startProject;