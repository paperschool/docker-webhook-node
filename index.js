#!/usr/bin/env node
'use strict';

const bodyparser = require('body-parser');

const express = require('express');

const config = require('./config');

const PORT = 7777;

if(!config.login()) return;

const app = express();

app.use(bodyparser.json());

app.listen(PORT,() => {
    console.log(`Docker Webhook - Server Listening on PORT ${PORT}`)
});

app.get('/',(req,res) => {
	console.log('Webhook Hit!');
	res.send('Docker Webhook is Up!');
});

app.post('/',(req,res) => {
    
    console.log('Webhook Hit!');
    
    if(config.handle(req.query,req.body)){
        console.log('Hook Triggered Restart!')        
        res.send('Hook Triggered Restart!');
    } else {
        console.log('Incorrect Config')
        res.send('Incorrect Config!');
    }

})

