const shell = require('shelljs');

const methods = {};

methods.login = (username, password) => {
    return shell.exec(`docker login -u ${username} -p ${password}`).code === 0;
}

methods.pull = repo_name => {
    return shell.exec(`docker pull ${repo_name}`).code === 0;
}

// this will change to docker container sha
methods.stop = name => {
    return shell.exec(`docker stop ${name}`).code === 0;
}

methods.rm = name => {
    return shell.exec(`docker rm ${name}`).code === 0;
}

methods.run = ({ name, repoName, portIn, portOut }) => {
    return new Promise((resolve, reject) => {
        shell.exec(
            `docker run -d --name ${name} -p ${portOut}:${portIn} ${repoName}`,
            { async: false }, (code, stdout, stderr) => {
                resolve({
                    code,
                    stdout,
                    stderr
                })
            })
    })
}

module.exports = methods;