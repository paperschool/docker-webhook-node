import Commander, { Command } from "commander";

import newProject from "./newProject";
import editProject from "./editProject";
import removeProject from "./removeProject";
import listProjects from "./listProjects";
import startProject from "./startProject";

const project: Commander.Command = new Command("project");

project.addCommand(newProject);
project.addCommand(editProject);
project.addCommand(removeProject);
project.addCommand(listProjects);
project.addCommand(startProject);

export default project;