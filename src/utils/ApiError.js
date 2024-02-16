class ApiError extends Error {
    constructor(
        statusCode,
        customMessage,
        errors = [],
        stack = ""
    ){
        const message = customMessage || "Something went wrong"; // Use custom message if provided, fallback to default
        
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}