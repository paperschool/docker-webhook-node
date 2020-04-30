import Commander, { Command } from "commander";
import configureDependency from "./configureDependency";
import { newDependency as newDependencyCreator } from "../../dependency";

const newDependency: Commander.Command = new Command("new")
    .command("new")
    .description("Create New Project Dependency Container")
    .action(async () => {

        const dependencyConfiguration = await configureDependency();

        if (newDependencyCreator(dependencyConfiguration)) {
            console.green(`Dependency ${dependencyConfiguration.dependencyName} Created Successfully!`)
        } else {
            console.red("Error Creating Dependency...");
        }

    })

export default newDependency;