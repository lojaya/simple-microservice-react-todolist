const response = pojo("status", "data", "message", "meta");

const responses = {
  custom: (status, data, message, meta) =>
    response(status, data, message, meta),
  found: (data, message = "success", meta) =>
    response(200, data, message, meta),
  internalServerError: (message = "Internal Server Error") =>
    response(500, null, message, null),
  badRequest: (message = "Bad Request") => response(400, null, message, null),
  notAuthorized: (message = "Not Authorized") =>
    response(401, null, message, null),
  forbidden: (message = "Forbidden") => response(403, null, message, null),
  notFound: (message = "Not Found") => response(404, null, message, null)
};

responses.error = (code, err, msg) => {
  let error = {};
  if (err) {
    error = { stack_message: err.message, stack: err.stack };
  }

  switch (code) {
    case 500:
      return Object.assign(error, responses.internalServerError(msg));
      break;
    case 400:
      return Object.assign(error, responses.badRequest(msg));
      break;
    case 401:
      return Object.assign(error, responses.notAuthorized(msg));
      break;
    case 403:
      return Object.assign(error, responses.forbidden(msg));
      break;
    case 404:
      return Object.assign(error, responses.notFound(msg));
      break;
    default:
      return Object.assign(
        error,
        responses.custom(code, null, "unexpected error", null)
      );
      break;
  }
};

module.exports = responses;
