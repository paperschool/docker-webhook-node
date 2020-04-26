import Commander, { Command } from "commander";
import {
    editProject as editProjectCreator
} from "../../project";

const editProject: Commander.Command = new Command("edit")
    .command("edit")
    .requiredOption('-en, --existing-name <existingName>', 'Existing Project Name.')
    .option('-nn, --new-name <newName>', 'New Project Name.')
    .option('-pi, --port-in <portIn>', 'Port the Container Exposes.')
    .option('-po, --port-out <portOut>', 'Port the App within the Container Exposes.')
    .description("Edit Existing Docker Webhook Project")
    .action(({ existingName, newName, portIn, portOut }: any) => {

        if (typeof newName === "undefined") {
            newName = existingName;
        }

        if (editProjectCreator(existingName, newName, portIn, portOut)) {
            console.green("Project Edited Successfully!")
        } else {
            console.red("Project Edit Unsuccessful...")
        }
    })

export default editProject;