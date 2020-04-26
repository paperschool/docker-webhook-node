const generateUrlTemplate = (projectName: string, token: string): string => {
    return `<url>/?projectName=${projectName}&token=${token}`;
}

export default generateUrlTemplate;