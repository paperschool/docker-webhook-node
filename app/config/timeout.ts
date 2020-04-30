import {
    write,
    open
} from "./file"

export const updateTimeout = (newTimeout: number): void => {
    const config = open();
    const newConfig = {
        ...config,
        timeout: newTimeout
    }
    write(newConfig)
}

export const getTimeout = (): number => {
    return parseInt(open().timeout)
}