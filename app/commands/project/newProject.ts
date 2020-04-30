import Commander, { Command } from "commander";
import configureProject, { ProjectConfiguration } from "./configureProject";
import {
    newProject as newProjectCreator
} from "../../project";

const newProject: Commander.Command = new Command("new")
    .command("new")
    .description("Create New Docker Webhook Project")
    .action(async () => {

        const projectConfiguration = await configureProject();

        newProjectCreator(projectConfiguration)
    })

export default newProject;