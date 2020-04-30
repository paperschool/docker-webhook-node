import Commander, { Command } from "commander";
import inquirer from "inquirer";
import {
    removeProject as removeProjectConfig, getProjectNames
} from "../../config";

const removeProject: Commander.Command = new Command("remove")
    .command("remove")
    .description("Remove Existing Docker Webhook Project")
    .action(() => {

        inquirer.prompt([
            {
                type: "list",
                name: "projectToBeRemoved",
                messages: "Choose Project to be Removed:",
                choices: getProjectNames()
            }
        ]).then(({ projectToBeRemoved }) => {

            if (removeProjectConfig(projectToBeRemoved)) {
                console.green("Project Removed Successfully!")
            } else {
                console.red("Project Removal Unsuccessful...")
            }
        });


    })

export default removeProject;