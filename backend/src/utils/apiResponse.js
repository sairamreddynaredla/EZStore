export const buildSuccessResponse = (data, { message = "Success", meta = {}, status = 200 } = {}) => ({
  success: true,
  message,
  data,
  meta,
  status,
});

export const buildErrorResponse = (message, { status = 400, meta = {}, code = "BAD_REQUEST" } = {}) => ({
  success: false,
  message,
  data: null,
  meta: {
    ...meta,
    code,
    status,
  },
});

export const sendSuccess = (res, data, options = {}) => {
  const statusCode = options.status ?? 200;
  return res.status(statusCode).json(buildSuccessResponse(data, options));
};

export const sendError = (res, message, options = {}) => {
  const statusCode = options.status ?? 400;
  return res.status(statusCode).json(buildErrorResponse(message, options));
};
