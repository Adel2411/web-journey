const errorHandling = (err, req, res, next) => {
  console.log(err);
  return res.status(500).json({ err: true, msg: "Internal server error" });
};

export default errorHandling;
