/* eslint-disable @typescript-eslint/no-explicit-any */
import { BSONError } from "bson";


const handleBSONError = (err: BSONError) => {
const errorIssues:any = [
   {
      path: '', // Access the err.message property instead of err.path
      message: err.message,
   },
];

  return {
    statusCode: 400,
    message: "Invalid BSON data",
    errorMessage: err.message,
    errorDetails: {
      issues: errorIssues,
      name: err.name,
    },
  };
};

export default handleBSONError;
