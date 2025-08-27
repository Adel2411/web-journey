export function httpError(message, status = 500, code = "SERVER_ERROR") {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Note not found", code: "P2025" });
  }
  if (err.code === "P2002") {
    return res.status(400).json({ success: false, message: "Duplicate entry", code: "P2002" });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    code: err.code || "SERVER_ERROR",
  });
}
