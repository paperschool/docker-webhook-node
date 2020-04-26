# Docker Node Webhook

The purpose of this project was to create a light weight server for intercepting [Docker Hub Webhook](https://docs.docker.com/docker-hub/webhooks/) Requests to trigger containeer restarts for use within a simplistic ci/cd system. The application runs as a cli allows for starting the server as well as for managing the configuration the server will use. 

**n.b.** This is not a replacement for tools such as [**kuberntes**](https://kubernetes.io/) and should be used only for simple use cases, container orchestration can be a complex problem to solve and appropriate tools should always be used when possible!

### Table of contents 

- [Docker Node Webhook](#docker-node-webhook)
  * [Getting Started](#getting-started)
    + [Prerequisites](#prerequisites)
    + [Installing](#installing)
    + [Running](#running)
  * [Usage](#usage)
    + [Commands](#commands)
      - [Server Command](#server-command)
      - [Project Command](#project-command)
      - [Login Command](#login-command)
      - [Timeout Command](#timeout-command)
      - [Print Command](#print-command)
      - [Reset Command](#reset-command)
      - [Help Command](#help-command)
    + [Concepts](#concepts)
      - [Project Block](#project-block)
  * [Built With](#built-with)

## Getting Started

First either clone the repository or download a platform relevant ( windows, mac or linux ) binary of the application. 

### Prerequisites

In order to run the project from source you will need :

- [Node](https://nodejs.org/en/) - The runtime environment for the project
- [Docker](https://www.docker.com/get-started) - The containerisation tool this project uses for ci/cd

### Installing

#### Dependencies

If running the project from source, once cloned and/or unpacked navigate into the project and run ```yarn``` to install all required dev and runtime dependencies.

#### Building

To build a production candidate run ```yarn build:prod``` which will compile all required files to a bin folder.

### Running

When within the project directory running ```node .``` or will enter access to the cli tool. If the package is installed from NPM globally this can be accessed via ```dwn```.

## Usage

When Initially running the application, the program will attempt to locate a local copy of the config file used to manage the webhook server. If non-exists it will create a new one for you.

### Commands

To start the cli application simply enter the name of the executable in your shell of choice. eg

```
dwn [command] <options>
```

#### Server Command

This command will start the webhook listening server

```
dwn server
```

#### Project Command

This command has **three** sub commands all relevant to managing project blocks within the cli:

##### New Project

The `project new` sub-command accepts three required options a `project-name` value, a `port-in` value and a `port-out` value. All three are enough to generate a new project block within the configuration for the server.

```
dwn project new -pn my-project -pi 3000 -po 3000
```

##### Edit Projct 

The `project edit` sub-command accepts three required options and one optional one. It takes an `existing-project-name` value, the optional `new-project-name` value a `port-in` value and a `port-out` value.

```
dwn projct edit -en my-project -nn my-project-v2 -pi 3000 -po 3000
```

##### Remove Project 

The `project remove` sub-command accepts one required option, the `project-name` of the projected selected for deletion.

```
dwn projct edit -en my-project -nn my-project-v2 -pi 3000 -po 3000
```

#### Login Command

This command has **three** sub commands all relevant to authenticating with docker:

##### New Login

The `login new` sub-command accepts two required options a `username` value and a `password` value. When entered the command will attempt to login with these details and then if successful will store the credentials in the config file.

```
dwn login new -u <username> -p <password>
```

##### Try Login

The `login try` sub-command will attempt to authenticate with docker using credentials stored in the config file.

```
dwn login try
```

##### Reset Login

The `login reset` sub-command will delete all authentication credentials stored in the config file.

```
dwn login reset
```

#### Timeout Command

This command accepts a single required option, the desired cool down `time` ( in ms ) before valid webhooks are allowed to interrupt running projects:

```
dwn timeout -t 60000
```

#### Print Command

This command accepts no arguments and serves to output the entire config file.

```
dwn print
```

#### Reset Command

This command accepts no arguments and serves to reset the entire config file.

```
dwn print
```

#### Help Command

Provides a guide on all available commands at any given sub/command level.

```
dwn help
```

### Concepts

#### Project Block

This application can listen in on an any number of webhook requests to restart any number of docker images. In order to separate out the requests however the application expects in the webhook url a project name variable which refers to a project block in the config file as well as a token value which will be used to ensure parity between a webhook request and an internal managed image.

To setup a new project block run the command : 

```dwn project new -pn my-project -pi 80 -po 3000```

This will generate a new project block in the server config file like this :

```JSON
{
    "some-project-name": {
        "portIn": "80",
        "portOut": "3000",
        "token": <generated-token>,
        "dateTimeCreated": <generated-epoch-timestamp>,
        "dateTimeEdited": <generated-epoch-timestamp>,
        "sha": <running-docker-container-sha>
    }
}
```

The application will first output the generated token eg: 

```
59b9aea675f538498ac2f73be70ee9f010d08949216ca6ecacc7dfc340b6d424ec651352de735e9ea49701523442288c9425c2895dabbd7eb57aa738c84191c1
```

Then will output an example url with name and token parameters that should be modified with the host the webhook server is running on and copied into the webhook input on dockerhub :

```
<url>/?projectName=some-project-name&token=59b9aea675f538498ac2f73be70ee9f010d08949216ca6ecacc7dfc340b6d424ec651352de735e9ea49701523442288c9425c2895dabbd7eb57aa738c84191c1
```
#### Adding Dockerhub Webhook

The generated url can then be copied into a new webhook inside the webhook config editor dockerhub. Any time a new docker image is pushed to the given repo, a request will be made to all configured webhooks in docker hub.The request should include both the project name  and the token, if both match the config on the webhook server, then the application will pull this image, stop the currently running image and start the new image.

#### Authenticating Request

When a webhook hits the server the request url has two query parameters, a project name and a token. If both the project name exists in the server config and the token matches the token in the project block then the web hook is accepted. 

The request body ( provided by docker hub ) is then validated for all required information to successfully pull the image. 

#### Re/Deployment

When the application recieves an authenticated request, the request body is scraped of all required information and a series of docker commands are ran:

- The config login credentials are used to login to docker
- The docker image repo outlined in the request body is pulled
- Any existing versions of the image are stopped and deleted
- The pulled image is then started given the external and internal ports in the project block

When the re-deployment is successful a variable is updated in the project block with the current time which is used as a timeout to stop repeated attempts on the webhook.  

Finally the callback url in the webhook is hit to close the loop.

### Authors

* **Dominic Jomaa** - [Paperschool](https://github.com/paperschool)

### License

This project is licensed under the MIT License

### Built With

- [Express](https://expressjs.com)
- [Typescript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

