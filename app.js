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
const log = console.log;

// usage represents the help guide
const usage = function() {

  const usageText = `
  Node-docker-webhook allows you to set up a listening server to intercept docker image repository changes.

  usage:
  
    node-docker-webhook <command>

    commands:

    ${chalk.green('start')}:            used to start webhook server
    
    ${chalk.green('login')}:            used to add login credentials to config and test login
    ${chalk.green('try-login:')}        used to test config login credentials
    ${chalk.green('reset-login')}:      used to reset login credentials 


    ${chalk.green('add-project')}:      used to add a new project config
    ${chalk.green('edit-project')}:     used to edit an existing project config
    ${chalk.green('remove-project')}:   used to remove an existing project config
    
    ${chalk.green('reset')}:            used to Delete all user config ( Use with Caution ) 
    ${chalk.green('config')}:           used to print out config 
    ${chalk.green('help')}:             used to print the usage guide
  `
  console.log(usageText)
}


const login = () => {
    
    const user = args[3] || false;
    const pass = args[4] || false;

    const loginUsage = `

        Incorrect login arguments. 

        node-docker-webhook login <username> <password>

    `;

    if(config.login(true,user,pass)){
        config.setLogin(user,pass);
    } else {
        log(loginUsage);
    }

}

const removeProject = () => {

    const name = args[3] || false;

    const projectUsage = `

        Incorrect project removal arguments.

        node-docker-webhook remove-project <name>

    `; 

    if(name){
        config.removeProject(name);
    } else {
        log(projectUsage);
        return false;
    }

}

const modifyProject = () => {

    const name = args[3] || false;

    const portIn = args[4] || false;

    const portOut = args[5] || false;

    const projectUsage = `

        Incorrect project addition arguments.

        node-docker-webhook add-project <name> <inbound port> <outbound port>

    `; 

    if(name && portIn && portOut){
        config.modifyProject(name,portIn,portOut);
    } else {
        log(projectUsage);
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
        case 'help': 
            usage();
            break;
        default: 
            usage(); 
            break;
    }

}

arg();
