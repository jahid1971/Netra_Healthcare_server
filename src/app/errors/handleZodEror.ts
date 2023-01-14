/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";

const handlerZodError = (err: ZodError): any => {
    const errorIssues: any = err.issues.map((issue: any) => {
        return {
            path: issue.path[issue.path.length - 1],
            message: issue.message,
            code: issue.code,
            expected: issue.expected,
            received: issue.received,
        };
    });

    return {
        statusCode: 400,
        message: "Validation Error",
        errorMessage: errorIssues.map((value: any) => value.message).join(" "),
        errorDetails: {
            issues: errorIssues,
            name: err.name,
        },
    };
};

export default handlerZodError;
