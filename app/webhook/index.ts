import express, { Express, Request, Response } from "express";
import bodyparser from "body-parser"
import {
    getProjectNames
} from "../config";
import webhook from "./webhook";

const app: Express = express();

app.use(bodyparser.json());

app.get('/', (req: Request, res: Response) => {

    console.green('Webhook Front End Hit!');

    res.send(`
    <h1>Docker Webhook Frontend is Up!</h1>


    <h3>Running Projects: </h3>

    <ul>
        ${getProjectNames().map((projectName: string) => `<li>${projectName}</li>`).join("")}
    </ul>
`);

});

app.post('/', async (req: Request, res: Response) => {
    const { projectName, token }: any = req.query;
    const body = req.body;

    console.green('Webhook Hit!');

    if (await webhook(projectName, token, body)) {
        console.green('Hook Triggered Restart!');
        res.send('Hook Triggered Restart!');
    } else {
        console.red('Incorrect Config');
        res.send('Webhook Request Failed...');
    }

})

const PORT: number = 7777;
export default () =>
    app.listen(
        PORT,
        () => console.green(`Webhook Server Listening on port ${PORT}`)
    );