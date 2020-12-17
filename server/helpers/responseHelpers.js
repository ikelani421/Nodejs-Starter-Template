import logger from './logger';

/**
 * @description - for formating response
 * @param {object} res the response object
 * @param {string} message The message to the client
* @param {object} data the data to from the activity
 * @param {Number} statusCode the status code to be sent to user
 * @param {String} status the status of the event
 * @param {boolean} socket boolean to know if the endpoint triggers a socket
 * @param {boolean} logResponse bool to log the response or not
 * @returns {object} returns response object with the necessary info
 */
const responseHelpers = (res, message, data = '', statusCode = 400,
  status = 'error', socket = false, logResponse = true) => {
  const { req } = res;
  const {
    passWord, newPassword, oldPassWord, ...otherBodyData
  } = req.body;

  logger.log({
    level: status === 'error' ? 'error' : 'info',
    method: req.method,
    url: req.url,
    clientInfo: req.headers['user-agent'],
    user: req.user ? req.user.id : {},
    requestData: otherBodyData || {},
    responseMessage: message,
    responseData: logResponse ? data : {},
  });

  res.status(statusCode).json({
    status,
    message,
    data,
    socket
  });
};

export default responseHelpers;
