import DependencyType from "./DependencyType";
import {
    writeDependency
} from "../config"
import { DependencyConfiguration } from "../commands/dependency/configureDependency";


const saveDependency = ({
    dependencyName,
    dependencyRepo,
    canRestart,
    volumeMountPath
}: DependencyConfiguration) => {

    const dependency: DependencyType = {
        dependencyName,
        dependencyRepo,
        canRestart,
        volumeMountPath,
        dateTimeCreated: Date.now(),
        dateTimeEdited: Date.now(),
        sha: ""
    }

    return writeDependency(dependencyName, dependency)
}

export default saveDependency;