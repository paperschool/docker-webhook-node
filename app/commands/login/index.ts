import Commander, { Command } from "commander";

import attemptNewLogin from "./attemptNewLogin";
import attemptExistingLogin from "./attemptExistingLogin";
import resetLogin from "./resetLogin";

const login: Commander.Command = new Command("login");

login.addCommand(attemptNewLogin);
login.addCommand(attemptExistingLogin);
login.addCommand(resetLogin);

export default login;