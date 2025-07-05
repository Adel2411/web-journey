const handleError = (res, err, context = "Internal server error") => {
  res.status(500).json({
    success: false,
    error: context,
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export { handleError };
