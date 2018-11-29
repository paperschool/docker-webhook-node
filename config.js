
const config = require('./config.json');

const shell = require('shelljs');

const fs = require('fs');

const methods = {};

methods.handle = ({ name, token },body = null) => {

    console.log("Checking Params!")

    // checking if params are supplied
    if(!name || !token) return false;

    console.log("Checking Name Config!")

    // checking if name param has matching object
    if(!config.hasOwnProperty(name)) return false;

    console.log("Checking Has Body!")

    if(!body) return false;

    console.log("Authenticating!")

    // checking name and token combination is successful
    if(!methods.authenticate(name,token)) return false;

    console.log("Checking Timeout!")

    if(!methods.timeout(name)) return true;

    return methods.execute(name,body);

}

methods.find = name => {
    return config.hasOwnProperty(name);
}

methods.script = name => {
    return config[name].script || false
}

methods.authenticate = (name,token) => {
    return config[name].token === token;
}

// checking if last update was less than 5 minutes ago ( to block repeated requests )
methods.timeout = name => {
    console.log(`Checking timeout Property In ${name}`)
    return Date.now() - config[name].last >= 320000
}

methods.updateTimeout = name => {
    console.log(`Updating timeout Property In ${name}`)
    config[name].last = Date.now();
    fs.writeFileSync('./config.json', JSON.stringify(config));  
}

methods.login = () => {

    if(!(config.cred.pass || config.cred.user)) {
        console.log("Docker Login Failed - No Login Credentials Found!")
        return false;
    }

    // login to docker
    if(shell.exec(`docker login -u ${config.cred.user} -p ${config.cred.pass}`).code !== 0){
        console.log("Docker Login Failed...")
        return false;
    } else {
        console.log("Docker Login Succeded!");        
        return true
    }

}

methods.execute = (name, body) => {

    // login to docker
    if(shell.exec(`docker login -u ${config.cred.user} -p ${config.cred.pass}`).code !== 0){
        console.log("Docker Login Failed...")
        return false;
    }

    if(shell.exec(`docker pull ${body.repository.repo_name}`).code !== 0){
        console.log("Docker Image pulled unsuccessfully!")
        return false;
    }

    if(shell.exec(`docker stop ${body.repository.name}`).code !== 0){
        console.log("Docker Image does not exist or incorrect name, nothing stopped!")
    }

    if(shell.exec(`docker rm ${body.repository.name}`).code !== 0){
        console.log("Docker Image does not exist or incorrect name, nothing removed!")
    }

    if(shell.exec(`docker run -d --name ${body.repository.name} -p ${config[name].portOut}:${config[name].portIn} ${body.repository.repo_name}`).code !== 0){
        console.log("Docker !")
    } else {
        console.log(`Docker Image ${body.repository.repo_name} Started Successfully!`)
    }

    methods.updateTimeout(name);

    return true

}

module.exports = methods;