# Node Dockerhub Webhook

The purpose of this project was to create a listening server for catching dockerhub webhook requests for use with ci/cd pipelines. The application runs as a cli for managing and configuring the embdedded webhook listening server. 

### Table of contents 

- [Node Dockerhub Webhook](#node-dockerhub-webhook)
    - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
  - [Usage](#usage)
    - [Commands](#commands)
    - [Project Block](#project-block)
  - [Authors](#authors)
  - [License](#license)
  - [Built With](#built-with)

## Getting Started

First either clone the repository or download a platform relevant ( windows, mac or linux ) binary of the application. 

### Prerequisites

In order to run the project from source you will need :

- [Node](https://nodejs.org/en/) - The runtime environment for the project
- [Docker](https://www.docker.com/get-started) - The containerisation tool this project uses for ci/cd

### Installing

If running the project from source, once cloned and/or unpacked navigate into the project and run ```npm install``` to install all required dev and runtime dependencies.

If running from a binary simply drag the execuitable to a location of choice on your server / deployment enviornment.

## Usage

When Initially running the application, the program will attempt to locate a local copy of the config file used to manage the webhook server. If non-exists it will create a new one for you.

### Commands

To start the cli application simply enter the name of the execuitable in your shell of choice. eg

```
./node-docker-webhook-linux [command] <options>
```


| Command | Options | Description |
| :------------- |:-------------| :--- |
| ```start``` | n/a | This will start the webhook server on port 7777. |
| ```login``` | ```<username> <password>``` | This will take the username and password arguments and attempt to login to docker with them, if successful will append the credientials to the server config file. **note credentials saved in plaintext**. |
| ```try-login```  | n/a | This command will attempt to login to docker with the current  credentials in the server config. |
| ```reset-login```  | n/a | This command will clear all saved credentials in the server config file. |
| | |
| ```add-project```  | ```<project-name> <inbound-port> <outbound-port>``` | This command will add a project block under ```project-name``` in the server config file which the server will reference when a webhook request hits the server. The port specification is to choose the ports the docker container will expose externally and internally. A 128 character key is also generated as a token for the webhook which will be output to be added a paramter to the webhook url. |
| ```edit-project```  | ```<project-name> <inbound-port> <outbound-port>``` | This command will edit a project block under the name ```project-name``` in the server config file. Simply replace any variables in the command with the new ones and the block will be updated. **The 128 character token will also be regenerated.** |
| ```remove-project```  | ```<project-name>``` | This command will remove a project block under the server config file under the name ```<project-name>``` |
| | | 
| ```reset```  | n/a | This comnmand will fully reset the server config of login credentials and project blocks |
| ```config```  | n/a | This comnmand will output the current state of the config |
| ```help```  | n/a | A print out of all possible commands and their descriptions. |

### Project Block

This application can listen in on an any number of webhook requests to restart any number of docker images. In order to seperate out the requests however the application expects in the webhook url a name variable which refers to a project block in the config file.

To setup a new project block run the command : 

```node-docker-webhook new-project some-project-name 80 3000```

This will generate a new project block in the server config file like this :

```JSON
{
    "some-project-name": {
        "portIn" : "80",
        "portOut": "3000",
        "token"  : <generated-token>,
        "last"   : <generated-epoch-timestamp>
    }
}
```

The command will output an example url with name and token parameters that should be modified with your domain and copied into the webhook input on dockerhub :

```
Generated New Token : 

59b9aea675f538498ac2f73be70ee9f010d08949216ca6ecacc7dfc340b6d424ec651352de735e9ea49701523442288c9425c2895dabbd7eb57aa738c84191c1

Use this token in the webhook url on docker hub eg:

<url>/?name=some-project-name&token=59b9aea675f538498ac2f73be70ee9f010d08949216ca6ecacc7dfc340b6d424ec651352de735e9ea49701523442288c9425c2895dabbd7eb57aa738c84191c1
```



## Authors

* **Dominic Jomaa** - [Paperschool](https://github.com/paperschool)

## License

This project is licensed under the MIT License

## Built With

* [Node](http://www.dropwizard.io/1.0.2/docs/) - Runtime, Package Manager, CLI.
* [PKG]() - Packaging tool for binaries.

