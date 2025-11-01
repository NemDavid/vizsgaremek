const { NotFoundError, AppError } = require("../errors");

function notFound(req, res, next)
{
    next(new NotFoundError());
}

function showError(error, req, res, next)
{
    if(!(error instanceof AppError))
    {
        error = new AppError("Internal Server Error", 
        {
            isOperational: false,
            details: process.env.NODE_ENV !== "production" ? error.message : undefined,
            stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
        });
    }

    error.details = process.env.NODE_ENV !== "production" ? error.details : undefined;

    error.stack = process.env.NODE_ENV !== "production" ? error.stack : undefined;

    res.status(error.statusCode).json(
    {
        message: error.message,
        ...error,
    });
}

module.exports = { notFound, showError };
