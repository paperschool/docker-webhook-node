import Commander, { Command } from "commander";

import newDependency from "./newDependency";
import editDependency from "./editDependency";
import removeDependency from "./removeDependency";
import listDependencies from "./listDependencies";

const project: Commander.Command = new Command("dependency");

project.addCommand(newDependency);
project.addCommand(editDependency);
project.addCommand(removeDependency);
project.addCommand(listDependencies);

export default project;