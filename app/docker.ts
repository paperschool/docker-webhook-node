import shell from "shelljs";

export const login = (username: string, password: string): boolean => {
    return shell.exec(`docker login -u ${username} -p ${password}`).code === 0;
}

export const pull = (imageName: string): boolean => {
    return shell.exec(`docker pull ${imageName}`).code === 0;
}

export const stop = (imageName: string): boolean => {
    return shell.exec(`docker stop ${imageName}`).code === 0;
}

export const remove = (imageName: string): boolean => {
    return shell.exec(`docker rm ${imageName}`).code === 0;
}

export const run = async (imageName: string, repoName: string, portIn: number, portOut: number): Promise<any> => {
    return await shell.exec(`docker run -d --name ${imageName} -p ${portOut}:${portIn} ${repoName}`)
}


