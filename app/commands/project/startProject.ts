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
                type: "checkbox",
                name: "projectNames",
                messages: "Select Project/s to be started:",
                choices: currentProjects
            }
        ]).then(({ projectNames }) => {
            projectNames.forEach(async (projectName: string) => {
                await projectStarter(projectName);
            });
        });
    })

export default startProject;