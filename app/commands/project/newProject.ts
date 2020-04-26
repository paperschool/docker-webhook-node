import Commander, { Command } from "commander";
import {
    newProject as newProjectCreator
} from "../../project";

const newProject: Commander.Command = new Command("new")
    .command("new")
    .requiredOption('-pn, --project-name <projectName>', 'New Project Name.')
    .requiredOption('-pi, --port-in <portIn>', 'Port the Container Exposes.')
    .requiredOption('-po, --port-out <portOut>', 'Port the App within the Container Exposes.')
    .description("Create New Docker Webhook Project")
    .action(({ projectName, portIn, portOut }: any) => {

        if (newProjectCreator(projectName, portIn, portOut)) {
            console.green("New Project Created Successfully!")
        } else {
            console.red("New Project Creation Unsuccessful...")
        }
    })

export default newProject;