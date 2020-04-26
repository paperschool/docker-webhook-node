import generateUrlTemplate from "./generateUrlTemplate";

const newHookOutput = (projectName: string, token: string) => {

    console.green("Use this token in the webhook editor on docker hub:")
    console.server();
    console.server(token);
    console.server();
    console.green("Add to a docker hub webhook:")
    console.server();
    console.server(generateUrlTemplate(projectName, token))
    console.server();

}

export default newHookOutput; 
