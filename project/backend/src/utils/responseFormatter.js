export const successResponse = (res, data, message = "Success") => {
    return res.json({
        status: "success",
        message,
        data
    });
};

export const createdResponse = (res, data, message = "Note created") => {
    return res.status(201).json({
        status: "success",
        message,
        data
    });
};

export const errorResponse = (res, statusCode = 500, message = "Internal server error", details = null) => {
    return res.status(statusCode).json({
        status: "error",
        message,
        details
    });
};

export const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
        status: "Unprocessable Content",
        errors
    });
};

export const notFoundResponse = (res, message = "Note not found") => {
    return res.status(404).json({
        status: "error",
        message
    });
};

export const badRequestResponse = (res, message = "Bad Request") => {
  return res.status(400).json({
    status: "Bad Request",
    message
  });
};
