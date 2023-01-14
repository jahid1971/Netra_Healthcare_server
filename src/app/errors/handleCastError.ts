/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const handleCastError = (err: mongoose.Error.CastError) => {
    const errorIssues:any = [
        {
            stringValue: err.stringValue,
            valueType: "string",
            kind: err.kind,
            value: err.value,
            path: err.path,
            reason: {},
            name: err.name,
            message: err.message,
        },
    ];

   return {
      statusCode: 400,
      message: "Invalid Id",
      errorMessage: `${err.value} is not a valid id`,
      errorDetails: errorIssues[0],
   };
};
export default handleCastError;
