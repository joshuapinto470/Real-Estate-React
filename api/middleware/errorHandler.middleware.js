/* eslint-disable no-unused-vars */
export const errorHandlerMiddleware = (err, req, res, next) => {  
    console.log(`Error [${err.route}] : ${err.message}`);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
}