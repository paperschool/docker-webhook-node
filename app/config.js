const Crypto = require('crypto-random-string');

const request = require('request');

const chalk = require('chalk');

const fs = require('fs');

const path = require('path');

const log = require("./log");

const dockerCommands = require("./docker");

const configPath = path.join(process.cwd(), 'config.json');

let config;

const methods = {};

methods.init = () => {
    // establishing config file if new install or file damaged
    if (methods.establishConfig()) {
        config = require(configPath);
    }
}

methods.handle = ({ name, token }, body = null) => {

    log(chalk.white('Checking Params!'))

    // checking if params are supplied
    if (!name || !token) return false;

    // checking if name param has matching object
    if (!config.project.hasOwnProperty(name)) {
        log(chalk.red(`Project with Name : ${name} does not exist!`));
        return false;
    } else {
        log(chalk.green(`Project Block with name ${name} exists!`));
    }

    if (!methods.validateProject(name)) {
        log(chalk.red('Project config not validated correctly!'));
        return false;
    } else {
        log(chalk.green(`Project Block ${name} config valid!`));

    }

    if (!methods.validateBody(body)) {
        return false;
    }

    // checking name and token combination is successful
    if (!methods.authenticate(name, token)) {
        log(chalk.red('Request Token not valid!'));
        return false;
    } else {
        log(chalk.green('Request Name and Token Valid!'));
    }


    if (!methods.timeout(name)) {
        log(chalk.yellow('Image still in date, nothing to do!'));
        return true;
    } else {
        log(chalk.green('Image out of date!'));
    }

    return methods.execute(name, body)

}

methods.respond = url => {
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            log(chalk.green('Docker Hub Callback Successful'))
        } else {
            log(chalk.red('Docker Hub Callback unSuccessful'))
        }
    })
    return true;
}

methods.validateProject = name => {
    let projConf = config.project[name];
    return projConf.hasOwnProperty('token') &&
        projConf.hasOwnProperty('last') &&
        projConf.hasOwnProperty('portIn') &&
        projConf.hasOwnProperty('portOut');
}

methods.validateBody = body => {

    if (!body) {
        log(chalk.red('Missing Body Object!'));
        return false;
    }

    if (!body.hasOwnProperty('repository')) {
        log(chalk.red('Body missing repository object!'));
        return false;
    }

    if (!body.repository.hasOwnProperty('name')) {
        log(chalk.red('Repository missing name property!'));
        return false;
    }

    if (!body.repository.hasOwnProperty('repo_name')) {
        log(chalk.red('Repository missing repo_name property!'));
        return false;
    }

    if (!body.hasOwnProperty('callback_url')) {
        log(chalk.red('Repository missing callback url property!'));
        return false;
    }

    return true;

}

methods.script = name => {
    return config.project[name].script || false
}

methods.authenticate = (name, token) => {
    return config.project[name].token === token;
}

// checking if last update was less than 5 minutes ago ( to block repeated requests )
methods.timeout = name => {
    log(chalk.yellow(`Checking timeout Property In ${name}`));
    return Date.now() - config.project[name].last >= config.timeout
}

methods.setWebhookTimeout = timeout => {
    log(chalk.yellow(`Setting Webhook Timeout Property`));
    config['timeout'] = timeout;
    methods.configWrite(config);
}

methods.updateProjectTimeout = name => {
    log(chalk.yellow(`Updating timeout Property In ${name}`));
    config.project[name].last = Date.now();
    methods.configWrite(config);
}

methods.updateProjectSha = (name, sha) => {
    log(chalk.yellow(`Updating sha Property In ${name}`));
    config.project[name].sha = sha.replace(/['\r?\n|\r]*/gmi, '');
    log(config.project[name].sha)
    methods.configWrite(config);
}

methods.setLogin = (username, password) => {
    log(chalk.yellow(`Updating Credential Properties`));
    config.cred = {
        "user": username,
        "pass": password
    }
    methods.configWrite(config);
}

methods.resetLogin = () => {
    config.cred = {
        "user": null,
        "pass": null
    }
    methods.configWrite(config);
    log(chalk.yellow("Docker login credentials reset!"))
}

methods.login = async (test = false, username, password) => {

    if (test && !username) {
        log(chalk.red("Docker Login Failed - No Username Credential Supplied!"));
        return false;
    }

    if (test && !password) {
        log(chalk.red("Docker Login Failed - No Password Credential Supplied!"));
        return false;
    }

    username = username || config.cred.user;
    password = password || config.cred.pass;

    if (!test && !(username && password)) {
        log(chalk.red("Docker Login Failed - No Login Credentials found in Config!"));
        return false;
    }

    if (dockerCommands.login(username, password)) {
        log(chalk.green("Docker Login Succeded!"));
        return true;
    } else {
        log(chalk.red("Docker Login Failed..."));
        return false;
    }

}

methods.findProject = name => {
    return config.project.hasOwnProperty(name);
}

methods.removeProject = name => {

    if (!methods.findProject(name)) {
        log(chalk.red("Docker Project not found!"));
        return false;
    }

    delete config.project[name];

    methods.configWrite(config)

    log(chalk.green(`Docker project ${name} removed successfully!`));

}

methods.modifyProject = (name, newName, portIn, portOut) => {

    const token = methods.generateKey(128);

    if (methods.findProject(name)) {
        log(chalk.yellow(`Docker Project ${name} exists already, overwriting existing project config!`));
    } else {
        log(chalk.green(`Docker project ${name} added successfully`));
    }

    log(`Generated New Token : \n\n${chalk.blue(token)}\n\nUse this token in the webhook url on docker hub eg:\n\n<url>/?name=${chalk.red(name)}&token=${chalk.blue(token)}
    `)

    const newProject = {
        "portIn": portIn,
        "portOut": portOut,
        "token": token,
        "last": 0
    }

    // delete old project
    delete config.project[name];

    // append new project
    config[newName] = newProject

    methods.configWrite(config);
}

methods.generateKey = (length = 64) => {
    return Crypto(length)
}

methods.establishConfig = () => {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, '', 'ascii');
        methods.resetConfig(true);
    }
    return true;
}

methods.resetConfig = (silent = false) => {

    const newConfig = {
        "cred": {
            "user": null,
            "pass": null
        },
        "timeout": 320000,
        "project": {}
    }

    methods.configWrite(newConfig);

    if (!silent) log(chalk.green('Docker config reset!'))
}

methods.configWrite = config => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
}

methods.printConfig = () => {
    log();
    log(JSON.stringify(config, null, 4))
    log();
}

methods.execute = (name, body) => {

    const repoName = body.repository.repo_name;
    const callbackUrl = body.callback_url;

    const username = config.cred.user;
    const password = config.cred.pass;

    if (dockerCommands.login(username, password)) {
        log(chalk.green("Docker Logged in successfully!"));
    } else {
        log(chalk.red("Docker Login Failed..."));
        return false;
    }

    if (dockerCommands.pull(repoName).code === 0) {
        log(chalk.red(`Docker image ${repoName} pulled unsuccessfully!`));
        return false;
    }

    if (!dockerCommands.stop(name)) {
        log(chalk.red("Docker Image does not exist or incorrect name, nothing stopped!"));
    }

    if (!dockerCommands.rm(name)) {
        log(chalk.red("Docker Image does not exist or incorrect name, nothing removed!"));
    }

    const run = dockerCommands.run({
        name,
        repoName,
        portIn: config.project[name].portIn,
        portOut: config.project[name].portOut
    })

    run.then(run => {
        if (run.code === 0) {
            log(chalk.green(`Docker Image ${repoName} Started Successfully!`));
            methods.updateProjectSha(name, run.stdout)
        } else {
            log(chalk.red("Docker Image not started!"));
        }

    })

    methods.updateProjectTimeout(name);
    methods.respond(callbackUrl);

    return true

}

module.exports = methods;
