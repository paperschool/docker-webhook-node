import Commander, { Command } from "commander";
import inquirer from "inquirer";
import {
    getDependencyNames,
    removeDependency
} from "../../config";

const editDependency: Commander.Command = new Command("remove")
    .command("remove")
    .description("Remove Existing Project Dependency")
    .action(async () => {

        inquirer.prompt([
            {
                type: "list",
                name: "dependencyToBeRemoved",
                messages: "Choose Dependency to be Removed:",
                choices: getDependencyNames()
            }
        ]).then(({ dependencyToBeRemoved }) => {
            if (removeDependency(dependencyToBeRemoved)) {
                console.green(`Dependency ${dependencyToBeRemoved} Removed Successfully!`)
            } else {
                console.red("Error Removing Dependency...");
            }
        });
    })

export default editDependency;