import { DependencyConfiguration } from "../commands/dependency/configureDependency";

import saveDependency from "./saveDependency";

import {
    dependencyExists,
} from "../config"

const newDependency = (dependency: DependencyConfiguration) => {

    if (dependencyExists(dependency.dependencyName)) {
        console.red(`Dependency ${dependency.dependencyName} Already Exists...`);
        return false;
    }

    return saveDependency(dependency)

}

export default newDependency;