import Commander, { Command } from "commander";
import inquirer from "inquirer";
import {
    getProjectNames,
    getProject
} from "../../config";

const listProjects: Commander.Command = new Command("list")
    .command("list")
    .description("Inspect all Projects")
    .action(async () => {

        const currentProjects = getProjectNames();

        if (currentProjects.length === 0) {
            console.yellow("No Projects Configured!");
            return;
        }

        inquirer.prompt([
            {
                type: "list",
                name: "projectName",
                messages: "Choose Project to be Inspect:",
                choices: currentProjects
            }
        ]).then(({ projectName }) => {
            console.server(getProject(projectName));
        });

    })

export default listProjects;