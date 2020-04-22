#!/usr/bin/env node
'use strict';

const chalk = require('chalk')

const bodyparser = require('body-parser');

const fs = require("fs");

const express = require('express');

const app = express();

const config = require('./config.js');

const PORT = 7777;

const log = require("./log");

const configFile = fs.readFileSync("./config.json");

const currentProjects = Object.keys(JSON.parse(configFile).project);

module.exports = () => {

    if (!config.login()) return;

    app.use(bodyparser.json());

    app.get('/', (req, res) => {

        log(chalk.green('Webhook Front End Hit!'));
        res.send(`
		<h1>Docker Webhook Frontend is Up!</h1>


		<h3>Running Projects: </h3>

		<ul>
			${currentProjects.map(project => `<li>${project}</li>`).join("")}
		</ul>
	`);

    });

    app.post('/', (req, res) => {

        log(chalk.green('Webhook Hit!'));

        if (config.handle(req.query, req.body)) {
            log(chalk.green('Hook Triggered Restart!'));
            res.send('Hook Triggered Restart!');
        } else {
            log(chalk.red('Incorrect Config'));
            res.send('Incorrect Config!');
        }

    })

    app.listen(PORT, () => {
        log(chalk.green(`Docker Webhook - Server Listening on PORT ${PORT}`))
    });

}

