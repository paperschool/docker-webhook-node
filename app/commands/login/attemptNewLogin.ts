import Commander, { Command } from "commander";
import {
    login as dockerLogin
} from "../../docker";
import {
    setCredentials
} from "../../config";

const attempt: Commander.Command = new Command("new")
    .command("new")
    .requiredOption('-u, --username <username>', 'Username Credential for Docker Account.')
    .requiredOption('-p, --password <password>', 'Password Credential for Docker Account.')
    .description("Attempt Docker Login Using New Credentials")
    .action(({ username, password }: any) => {
        if (dockerLogin(username, password)) {
            setCredentials(username, password)
            console.green("New Login Credentials Validated and Stored!")
        } else {
            console.red("New Login Credentials Invalid...")
        }
    })

export default attempt;