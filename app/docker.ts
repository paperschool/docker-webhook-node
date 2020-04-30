import shell from "shelljs";

export const login = (username: string, password: string): boolean => {
    return shell.exec(`docker login -u ${username} -p ${password}`, { silent: true }).code === 0;
}

export const pull = (imageName: string): boolean => {
    return shell.exec(`docker pull ${imageName}`, { silent: true }).code === 0;
}

export const stop = (imageName: string): boolean => {
    return shell.exec(`docker stop ${imageName}`, { silent: true }).code === 0;
}

export const remove = (imageName: string): boolean => {
    return shell.exec(`docker rm ${imageName}`, { silent: true }).code === 0;
}

export const run = async (containerName: string, repoName: string, portIn?: number, portOut?: number): Promise<any> => {
    if (portIn && portOut) {
        return await shell.exec(`docker run -d --name ${containerName} -p ${portOut}:${portIn} ${repoName}`, { silent: true })
    } else {
        return await shell.exec(`docker run -d --name ${containerName} ${repoName}`, { silent: true })

    }
}

export const isContainerRunning = (containerSha: string): boolean => {
    return shell.exec(`docker inspect ${containerSha}`, { silent: true }).code === 0;
}

export const networkCreate = async (networkName: string): Promise<any> => {
    return await shell.exec(`docker network create ${networkName}`, { silent: true })
}

export const networkExists = async (networkName: string): Promise<any> => {
    return await shell.exec(`docker network inspect ${networkName}`, { silent: true }).code === 0
}

export const networkConnect = async (networkName: string, containerName: string): Promise<any> => {
    return await shell.exec(`docker network connect ${networkName} ${containerName}`, { silent: true }).code === 0
}


