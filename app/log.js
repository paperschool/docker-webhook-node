const chalk = require("chalk")

const dateTime = () => {
    const currentDateTime = new Date();
    const date = [
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDay()
    ].join("-")

    const time = [
        currentDateTime.getHours(),
        currentDateTime.getMinutes(),
        currentDateTime.getSeconds()
    ].join(":")

    return date + " " + time + ":"
}

const log = (value, chalkColour) => {
    switch (chalkColour) {
        case "red":
            return console.log(dateTime(), chalk.red(value));
        case "blue":
            return console.log(dateTime(), chalk.blue(value));
        case "green":
            return console.log(dateTime(), chalk.green(value));
        case "yellow":
            return console.log(dateTime(), chalk.green(value));
        default:
            return console.log(dateTime(), value);
    }
}

module.exports = log;