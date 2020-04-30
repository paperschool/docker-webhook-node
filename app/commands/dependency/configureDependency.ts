import inquirer, { ListQuestion, InputQuestion } from "inquirer";
import { getDependencyNames } from "../../config";

export interface DependencyConfiguration {
    dependencyName: string;
    dependencyRepo: string;
    canRestart: boolean;
    volumeMountPath: string;
}

const setupProjectDependency = (edit?: boolean): Promise<DependencyConfiguration> => {
    return new Promise((resolve) => {

        let newDependencyNameQuestion: InputQuestion = {
            type: "input",
            name: "dependencyName",
            message: "Project Dependency Name (project-db):"
        };

        let editDependencyNameQuestion: ListQuestion = {
            type: "list",
            name: "dependencyName",
            message: "Pick Existing Project Dependency:",
            choices: getDependencyNames()
        }

        inquirer.prompt([
            edit ? editDependencyNameQuestion : newDependencyNameQuestion,
            {
                type: "input",
                name: "dependencyRepo",
                message: "Image Name (mongo):"
            },
            {
                type: "confirm",
                name: "canRestart",
                message: "Can Dependency Be Restarted:"
            },
            {
                type: "input",
                name: "volumeMountPath",
                message: "Volume Mount Path for Dependency:"
            }
        ]).then((dependencyConfiguration: DependencyConfiguration) => {
            resolve({
                ...dependencyConfiguration
            });
        })

    })
};


export default setupProjectDependency