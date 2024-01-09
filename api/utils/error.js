export const errorHandler = (statusCode, message, route = '/') => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.route = route;
    return error;
};