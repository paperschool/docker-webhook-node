import Commander, { Command } from "commander";
import configureProject from "./configureProject";
import {
    editProject as editProjectCreator
} from "../../project";

const editProject: Commander.Command = new Command("edit")
    .command("edit")
    .description("Edit Existing Docker Webhook Project")
    .action(async () => {

        const projectConfiguration = await configureProject(true);

        if (editProjectCreator(projectConfiguration)) {
            console.green("Project Edited Successfully!")
        } else {
            console.red("Project Edit Unsuccessful...")
        }
    })

export default editProject;