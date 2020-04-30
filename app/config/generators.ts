import { v4 } from "uuid";

export const emptyConfig = () => {
    return {
        ...credentials("", ""),
        timeout: 10000,
        projects: {},
        dependencies: {},
    }
}

export const credentials = (username: string, password: string) => {
    return {
        credentials: {
            username,
            password
        }
    }
}

export const uuid = () => v4()
