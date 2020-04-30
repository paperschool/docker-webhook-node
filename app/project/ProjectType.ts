type Project = {
    portIn: number;
    portOut: number;
    dateTimeCreated: number;
    dateTimeEdited: number;
    token: string;
    dependencies: string[];
    networkName: string;
    sha?: string;
}

export default Project;