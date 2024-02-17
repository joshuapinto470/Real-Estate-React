/**
 * 
 * @param {int} statusCode - The status code of the error sent to the client.
 * @param {string} message - The Error message.
 * @param {string} route - The route the error occured. This is mainly for debugging purposes.
 * @returns error object.
 */
export const errorHandler = (statusCode, message, route = '/') => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.route = route;
    return error;
};