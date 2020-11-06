import inquirer, { InputQuestion, ListQuestion } from "inquirer";
import { getDependencyNames, getProjectNames } from "../../config";

export interface ProjectConfiguration {
    projectName: string;
    repoName: string;
    portIn: number;
    portOut: number;
    dependencies: string[];
    networkName: string
}

const configureProject = async (edit?: boolean): Promise<ProjectConfiguration> => {
    return new Promise((resolve) => {

        let newProjectNameQuestion: InputQuestion = {
            type: "input",
            name: "projectName",
            message: "Project Name (my-app):"
        };

        let editProjectNameQuestion: ListQuestion = {
            type: "list",
            name: "projectName",
            message: "Pick Existing Project Dependency:",
            choices: getProjectNames()
        }

        inquirer.prompt([
            edit ? editProjectNameQuestion : newProjectNameQuestion,
            {
                type: 'input',
                name: "repoName",
                message: "RepoName (Docker Username):"
            },
            {
                type: 'input',
                name: "portIn",
                message: "Internal Port (3000):"
            },
            {
                type: 'input',
                name: "portOut",
                message: "Externally Exposed Port (3001):"
            },
            {
                type: 'input',
                name: "portOut",
                message: "Externally Exposed Port (3001):"
            },
            {
                type: 'checkbox',
                name: 'dependencies',
                message: 'Select Dependencies or Press Enter:',
                choices: getDependencyNames()
            },
            {
                type: 'input',
                name: "networkName",
                message: "Name of Network (my-app-network) or Press Enter:"
            },
        ]).then((projectConfiguration: ProjectConfiguration) => {
            resolve(projectConfiguration);
        })
    })
};


export default configureProject;