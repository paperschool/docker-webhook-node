import { DependencyConfiguration } from "../commands/dependency/configureDependency";
import saveDependency from "./saveDependency";

import {
    dependencyExists,
} from "../config"

const editDependency = (dependency: DependencyConfiguration) => {

    if (!dependencyExists(dependency.dependencyName)) {
        console.red(`Dependency ${dependency.dependencyName} Does Not Exist...`);
        return false;
    }

    return saveDependency(dependency)

}

export default editDependency;