import Commander, { Command } from "commander";
import {
    removeProject as removeProjectConfig
} from "../../config";

const removeProject: Commander.Command = new Command("remove")
    .command("remove")
    .requiredOption('-pn, --project-name <projectName>', 'Name of Exiting Project Name to be Deleted.')
    .description("Edit Existing Docker Webhook Project")
    .action(({ projectName }: any) => {

        if (removeProjectConfig(projectName)) {
            console.green("Project Removed Successfully!")
        } else {
            console.red("Project Removal Unsuccessful...")
        }
    })

export default removeProject;