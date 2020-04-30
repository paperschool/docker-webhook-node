import {
    credentials
} from "./generators";
import {
    write,
    open
} from "./file";

export const resetCredentials = (): void => {
    setCredentials("", "")
}

export const setCredentials = (username: string, password: string): void => {
    const config = open();
    const newConfig = {
        ...config,
        ...credentials(username, password)
    }
    write(newConfig)
}

export const getCredentials = (): any => {
    const config = open();
    return config.credentials;
}