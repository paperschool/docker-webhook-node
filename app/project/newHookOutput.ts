const generateUrlTemplate = (projectName: string, token: string): string => {
    return `<url>/?projectName=${projectName}&token=${token}`;
}

const newHookOutput = (projectName: string, token: string) => {

    console.green("Use this token in the webhook editor on docker hub:")
    console.log();
    console.log(token);
    console.log();
    console.green("Add to a docker hub webhook:")
    console.log();
    console.log(generateUrlTemplate(projectName, token))
    console.log();

}

export default newHookOutput; 
