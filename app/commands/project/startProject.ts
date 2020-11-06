import Commander, { Command } from "commander";
import inquirer from "inquirer";
import { getProject, getProjectNames } from "../../config";
import {
    startProject as projectStarter
} from "../../project";

const startProject: Commander.Command = new Command("start")
    .command("start")
    .description("Start / Restart Docker Webhook Project")
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
            projectStarter(projectName);
        });
    })

export default startProject;