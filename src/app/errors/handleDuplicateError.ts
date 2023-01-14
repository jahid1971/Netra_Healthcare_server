/* eslint-disable @typescript-eslint/no-explicit-any */


const handleDuplicateError = (err: any): any => {
    //  using regex

    const match = err.message.match(/"([^"]*)"/);


    const extractedMessage = match && match[1];


    const errorIssues: any = [
        {
            path: "",
            message: `${extractedMessage} is already exists`,
        },
    ];
    return {
        statusCode: 400,
        message: "Duplicate Entry",
        errorMessage: errorIssues.map((value:any) => value.message).join(" "),
        errorDetails: {
            issues: errorIssues,
            name: err.name,
        },
    };
};

export default handleDuplicateError;
