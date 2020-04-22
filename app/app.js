#!/usr/bin/env node
'use strict';

// loging colours
const chalk = require('chalk')

// 
const server = require('./server');

//
const config = require('./config.js')

config.init();

//
const args = process.argv

// 
const log = require("./log");

const appName = "node-docker-webhook"

// usage represents the help guide
const usage = function () {

    const usageText = `
  Node-docker-webhook allows you to set up a listening server to intercept docker image repository changes.

  usage:
  
    ${chalk.blue(appName)} ${chalk.yellow('<command>')}

    commands:

    ${chalk.green('start')}:            used to start webhook server
    
    ${chalk.yellow('login')}:            used to add login credentials to config and test login
    ${chalk.yellow('try-login')}:        used to test config login credentials
    ${chalk.red('reset-login')}:      used to reset login credentials 

    ${chalk.yellow('add-project')}:      used to add a new project config
    ${chalk.yellow('edit-project')}:     used to edit an existing project config
    ${chalk.red('remove-project')}:   used to remove an existing project config
    
    ${chalk.red('reset')}:            used to Delete all user config ( Use with Caution ) 
    ${chalk.yellow('config')}:           used to print out config 
    ${chalk.yellow('timeout')}:          used to update the docker webhook timeout 
    ${chalk.yellow('help')}:             used to print the usage guide
  `
    console.log(usageText)
}


const login = () => {

    const user = args[3] || false;
    const pass = args[4] || false;

    const loginUsage = `

        Incorrect login arguments. 

        ${chalk.blue(appName)} ${chalk.yellow('login')} <username> <password>

    `;

    if (config.login(true, user, pass)) {
        config.setLogin(user, pass);
    } else {
        log(loginUsage);
    }

}

const removeProject = () => {

    const name = args[3] || false;

    const projectUsage = `

        Incorrect project removal arguments.

        ${chalk.blue(appName)} ${chalk.yellow('remove-project')} <name>

    `;

    if (name) {
        config.removeProject(name);
    } else {
        log(projectUsage);
        return false;
    }

}

const modifyProject = () => {

    const name = args[3] || false;

    const newName = args[4] || false;

    const portIn = args[5] || false;

    const portOut = args[6] || false;

    const projectUsage = `

        Incorrect project addition arguments.

        ${chalk.blue(appName)} ${chalk.yellow('add-project')} <name> <inbound port> <outbound port>

    `;

    if (name && newName && portIn && portOut) {
        config.modifyProject(name, newName, portIn, portOut);
    } else {
        log(projectUsage);
        return false;
    }

}

const setWebhookTimeout = () => {

    const webhookTimeout = args[3] || false;

    const webhookTimeoutUsage = `

        Incorrect webhook timeout argument.

        ${chalk.blue(appName)} ${chalk.yellow('timeout')} <time in ms>

    `;

    if (webhookTimeout && parseInt(webhookTimeout) > 0) {
        config.setWebhookTimeout(webhookTimeout);
    } else {
        log(webhookTimeoutUsage);
        return false;
    }

}

const arg = () => {

    const program = args.length < 3 ? 'help' : args[2];

    // 
    switch (program) {
        case 'start':
            server();
            break;
        case 'login':
            login();
            break;
        case 'try-login':
            config.login(false);
            break;
        case 'reset-login':
            config.resetLogin();
            break;
        case 'add-project':
            modifyProject();
            break;
        case 'edit-project':
            modifyProject();
            break;
        case 'remove-project':
            removeProject();
            break;
        case 'reset':
            config.resetConfig();
            break;
        case 'config':
            config.printConfig();
            break;
        case 'timeout':
            setWebhookTimeout();
            break;
        case 'help':
            usage();
            break;
        default:
            usage();
            break;
    }

}

arg();

