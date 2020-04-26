export const emptyConfig = () => {
    return {
        ...credentials("", ""),
        timeout: 10000,
        projects: {}
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