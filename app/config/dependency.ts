import Dependency from "../dependency/DependencyType";
import {
    open,
    write
} from "./file"

export const dependencyExists = (dependencyName: string): boolean => {
    const config = open();

    return config.dependencies.hasOwnProperty(dependencyName)
}

export const getDependencyNames = (): string[] => {
    const config = open();

    return Object.keys(config.dependencies);
}

export const getDependency = (dependencyName: string): Dependency => {
    const config = open();

    if (dependencyExists(dependencyName)) {
        return config.dependencies[dependencyName];
    }

}

export const setDependencySha = (dependencyName: string, newSha: string) => {
    const dependency = getDependency(dependencyName);
    const newDependency = {
        ...dependency,
        sha: newSha
    }
    writeDependency(dependencyName, newDependency);
}


export const writeDependency = (dependencyName: string, dependencyData: Dependency) => {
    const config = open();

    const newConfig = {
        ...config,
        dependencies: {
            ...config.dependencies,
            [dependencyName]: dependencyData
        }
    }

    return write(newConfig)
}

export const removeDependency = (dependencyName: string) => {
    const config = open();
    const newConfig = {
        ...config
    }

    if (dependencyExists(dependencyName)) {
        delete newConfig.dependencies[dependencyName];
        write(newConfig)
        return true;
    } else {
        return false;
    }

}