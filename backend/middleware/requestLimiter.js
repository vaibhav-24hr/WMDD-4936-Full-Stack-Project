const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers["content-length"] || "0");
  const maxSize = 1024 * 1024; // 1MB limit

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: "Request entity too large. Maximum size is 1MB.",
    });
  }

  next();
};

module.exports = { requestSizeLimiter };
