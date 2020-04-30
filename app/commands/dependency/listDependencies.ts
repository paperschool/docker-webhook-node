import Commander, { Command } from "commander";
import inquirer from "inquirer";
import {
    getDependencyNames,
    getDependency
} from "../../config";

const listDependencies: Commander.Command = new Command("list")
    .command("list")
    .description("Inspect all Dependencies")
    .action(async () => {

        const currentDependencies = getDependencyNames();

        if (currentDependencies.length === 0) {
            console.yellow("No Dependencies Configured!");
            return;
        }

        inquirer.prompt([
            {
                type: "list",
                name: "dependencyName",
                messages: "Choose Dependency to be Inspect:",
                choices: currentDependencies
            }
        ]).then(({ dependencyName }) => {
            console.server(getDependency(dependencyName));
        });

    })

export default listDependencies;