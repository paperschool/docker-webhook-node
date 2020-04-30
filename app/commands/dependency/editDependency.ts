import Commander, { Command } from "commander";
import configureDependency from "./configureDependency";
import { editDependency as editDependencyCreator } from "../../dependency";

const editDependency: Commander.Command = new Command("edit")
    .command("edit")
    .description("Create New Project Dependency Container")
    .action(async () => {

        const dependencyConfiguration = await configureDependency(true);

        if (editDependencyCreator(dependencyConfiguration)) {
            console.green(`Dependency ${dependencyConfiguration.dependencyName} Created Successfully!`)
        } else {
            console.red("Error Creating Dependency...");
        }

    })

export default editDependency;