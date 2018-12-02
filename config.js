const Crypto = require('crypto-random-string');

const request = require('request');

const chalk = require('chalk');

const config = require('./config.json');

const shell = require('shelljs');

const fs = require('fs');

const log = console.log;

const methods = {};

methods.handle = ({ name, token },body = null) => {

    log(chalk.white('Checking Params!'))

    // checking if params are supplied
    if(!name || !token) return false;

    // checking if name param has matching object
    if(!config.project.hasOwnProperty(name)){
        log(chalk.red(`Project with Name : ${name} does not exist!`));
        return false;
    } else {
        log(chalk.green('Checking Name Config!'));
    }

    if(!methods.validateProject(name)){
        log(chalk.red('Project config not validated correctly!'));
        return false;
    } else {
        log(chalk.green('Project Config Valid!'));
        
    }

    if(!methods.validateBody(body)){
         return false;
    }
    
    // checking name and token combination is successful
    if(!methods.authenticate(name,token)){
        log(chalk.red('Request Token not valid!'));
        return false;
    } else {
        log(chalk.green('Request Token Valid!'));
    }


    if(!methods.timeout(name)){
        log(chalk.yellow('Image still in date, nothing to do!'));
        return true;
    } else {
        log(chalk.green('Image out of date!'));
    }

    return methods.execute(name,body)

}

methods.respond = url => {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            log(chalk.green('Docker Hub Callback Successful'))
        } else {
            log(chalk.red('Docker Hub Callback unSuccessful'))
        }
    })
    return true;
}

methods.find = name => {
    return config.project.hasOwnProperty(name);
}

methods.validateProject = name => {
    let projConf = config.project[name];
    return projConf.hasOwnProperty('token') && 
           projConf.hasOwnProperty('last') && 
           projConf.hasOwnProperty('portIn') && 
           projConf.hasOwnProperty('portOut');    
}

methods.validateBody = body => {

    if(!body){
        log(chalk.red('Missing Body Object!'));
        return false;
    }

    if(!body.hasOwnProperty('repository')){
        log(chalk.red('Body missing repository object!'));
        return false;
    }

    if(!body.repository.hasOwnProperty('name')){
        log(chalk.red('Repository missing name property!'));
        return false;
    } 

    if(!body.repository.hasOwnProperty('repo_name')){
        log(chalk.red('Repository missing repo_name property!'));
        return false;
    } 

    if(!body.hasOwnProperty('callback_url')){
        log(chalk.red('Repository missing callback url property!'));
        return false;
    } 

    return true;

}

methods.script = name => {
    return config.project[name].script || false
}

methods.authenticate = (name,token) => {
    return config.project[name].token === token;
}

// checking if last update was less than 5 minutes ago ( to block repeated requests )
methods.timeout = name => {
    log(chalk.yellow(`Checking timeout Property In ${name}`));
    return Date.now() - config.project[name].last >= 320000
}

methods.updateTimeout = name => {
    log(chalk.yellow(`Updating timeout Property In ${name}`));
    config.project[name].last = Date.now();
    methods.configWrite(config);
}

methods.setLogin = (username, password) => {
    log(chalk.yellow(`Updating Credential Properties`));
    config.cred = {
        "user" : username,
        "pass" : password    
    }
    methods.configWrite(config);
}

methods.resetLogin = () => {
    config.cred = {
        "user" : null,
        "pass" : null    
    }
    methods.configWrite(config);
    log(chalk.yellow("Docker login credentials reset!"))
}

methods.login = (test = false, username, password) => {

    if(test && !(username && password) ) {
        log(chalk.red("Docker Login Failed - No Login Credentials Supplied!"));
        return false;
    }

    username = username || config.cred.user;
    password = password || config.cred.pass;

    if(!test && !(username && password)) {
        log(chalk.red("Docker Login Failed - No Login Credentials found in Config!"));
        return false;
    }
    
    // login to docker
    if(shell.exec(`docker login -u ${username} -p ${password}`).code !== 0){
        log(chalk.red("Docker Login Failed..."));
        return false;
    } else {
        log(chalk.green("Docker Login Succeded!"));        
        return true
    }

}

methods.removeProject = name => {
    
    if(!methods.find(name)){
        log(chalk.red("Docker Project not found!"));
        return false;
    }

    delete config.project[name];

    methods.configWrite(config)

    log(chalk.green(`Docker project ${name} removed successfully!`));

}

methods.modifyProject = ( name, portIn, portOut ) => {

    const token = methods.generateKey(128);

    if(methods.find(name)){
        log(chalk.yellow(`Docker Project ${name} exists already, overwriting existing project config!`));
    } else {
        log(chalk.green(`Docker project ${name} added successfully`));
    }

    log(`Generated New Token : \n\n${chalk.blue(token)}\n\nUse this token in the webhook url on docker hub eg:\n\n<url>/?name=${chalk.red(name)}&token=${chalk.blue(token)}
    `)

    config.project[name] = {
        "portIn"  : portIn,
        "portOut" : portOut,
        "token"   : token,
        "last"    : 0
    } 

    methods.configWrite(config);
    

}

methods.generateKey = ( length = 64 ) => {
    return Crypto(length)
}

methods.resetConfig = () => {

    const newConfig = {
        "cred" : {
            "user" : null,
            "pass" : null
        },
        "project" : {}
    }

    methods.configWrite(newConfig);
    
    log(chalk.green('Docker config reset!'))
}

methods.configWrite = c => {
    fs.writeFileSync('./config.json', JSON.stringify(c, null, 4));
}

methods.printConfig = () => {
    log();
    log(JSON.stringify(config,null,4))
    log();
}

methods.execute = (name, body) => {

    // login to docker
    if(shell.exec(`docker login -u ${config.cred.user} -p ${config.cred.pass}`).code !== 0){
        log(chalk.red("Docker Login Failed..."));
        return false;
    }

    if(shell.exec(`docker pull ${body.repository.repo_name}`).code !== 0){
        log(chalk.red("Docker Image pulled unsuccessfully!"));
        return false;
    }

    if(shell.exec(`docker stop ${body.repository.name}`).code !== 0){
        log(chalk.red("Docker Image does not exist or incorrect name, nothing stopped!"));
    }

    if(shell.exec(`docker rm ${body.repository.name}`).code !== 0){
        log(chalk.red("Docker Image does not exist or incorrect name, nothing removed!"));
    }

    if(shell.exec(`docker run -d --name ${body.repository.name} -p ${config.project[name].portOut}:${config.project[name].portIn} ${body.repository.repo_name}`).code !== 0){
        log(chalk.red("Docker Image not started!"));
    } else {
        log(chalk.green(`Docker Image ${body.repository.repo_name} Started Successfully!`));
    }

    methods.updateTimeout(name);

    methods.respond(body.callback_url);

    return true

}

module.exports = methods;