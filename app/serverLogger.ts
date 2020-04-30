declare global {
    interface Console {
        server(...args: any[]): void;
        red(...args: any[]): void;
        blue(...args: any[]): void;
        green(...args: any[]): void;
        yellow(...args: any[]): void;
        title(args: string): void;
    }

    interface Number {
        padZero(places: number): string
    }
}

const chalk = require("chalk")

Number.prototype.padZero = function (places): string {
    return this.toString().padStart(places, '0');
}

const dateTime = () => {
    const currentDateTime = new Date();
    const date = [
        currentDateTime.getFullYear().padZero(2),
        currentDateTime.getMonth().padZero(2),
        currentDateTime.getDay().padZero(2)
    ].join("-")

    const time = [
        currentDateTime.getHours().padZero(2),
        currentDateTime.getMinutes().padZero(2),
        currentDateTime.getSeconds().padZero(2)
    ].join(":")

    return date + " " + time + ":"
}

const configureLogger = () => {

    console.server = (...value: any[]) => {
        console.log(dateTime(), ...value)
    }

    console.red = (...value: any[]) => {
        console.server(chalk.red(...value));
    }

    console.blue = (...value: any[]) => {
        console.server(chalk.blue(...value));
    }

    console.green = (...value: any[]) => {
        console.server(chalk.green(...value));
    }

    console.yellow = (...value: any[]) => {
        console.server(chalk.yellow(...value));
    }

    console.title = (value: any) => {
        console.server()
        console.server(chalk.yellow(value));
        console.server(chalk.yellow("*".repeat(value.length)));
        console.server()

    }
}

export default configureLogger;