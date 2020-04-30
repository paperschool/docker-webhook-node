
type DependencyType = {
    dependencyName: string;
    dependencyRepo: string;
    canRestart: boolean;
    volumeMountPath: string;
    dateTimeCreated: number;
    dateTimeEdited: number;
    sha: string;
}

export default DependencyType;