import Commander, { Command } from "commander";
import inquirer from "inquirer";
import {
    login as dockerLogin
} from "../../docker";
import {
    setCredentials
} from "../../config";

const attempt: Commander.Command = new Command("new")
    .command("new")
    .description("Attempt Docker Login Using New Credentials")
    .action(() => {

        inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "Docker Username:"
            },
            {
                type: "input",
                name: "password",
                message: "Docker Password:"
            }
        ]).then(({ username, password }) => {

            console.yellow("Attempting to Authenticate with Docker...")
            if (dockerLogin(username, password)) {
                setCredentials(username, password)
                console.green("New Login Credentials Validated and Stored!")
            } else {
                console.red("New Login Credentials Invalid...")
            }
        })
    })

export default attempt;