import Commander, { Command } from "commander";

import newProject from "./newProject";
import editProject from "./editProject";
import removeProject from "./removeProject";

const project: Commander.Command = new Command("project");

project.addCommand(newProject);
project.addCommand(editProject);
project.addCommand(removeProject);

export default project;