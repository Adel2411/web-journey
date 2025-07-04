const handleError = (res, err, context = "Internal server error") => {
  console.error(`[Error] ${context}:`, err);

  if (err.code === "P1001") {
    return res.status(503).json({
      success: false,
      error: "Database is unreachable. Please try again later.",
    });
  }

  res.status(500).json({
    success: false,
    error: context,
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export { handleError };
