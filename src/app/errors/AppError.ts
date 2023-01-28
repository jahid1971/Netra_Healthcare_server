class AppError extends Error {
    public statusCode: number;
    public originalError?: Error | unknown;

    constructor(
        statusCode: number,
        message: string,
        error?: Error | unknown,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.originalError = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
