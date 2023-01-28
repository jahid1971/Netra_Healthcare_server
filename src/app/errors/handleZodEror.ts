/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { IErrorIssue, IGenericErrorResponse } from "../types/common";

const handlerZodError = (err: ZodError): IGenericErrorResponse => {
  const errorIssues: IErrorIssue[] = err.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1]?.toString() || "",
      message: issue.message,
      code: issue.code,
      expected: "expected" in issue ? issue.expected : undefined,
      received: "received" in issue ? issue.received : undefined,
    };
  });

  return {
    statusCode: 400,
    error: "Zod Validation Error",
    message: errorIssues.map((value: any) => value.message).join(" "),
    errorDetails: {
      name: err.name,
      issues: errorIssues,
    },
  };
};

export default handlerZodError;
