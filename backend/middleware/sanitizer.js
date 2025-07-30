const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Remove HTML tags and special characters
        req.body[key] = req.body[key]
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/[<>]/g, "") // Remove < and >
          .trim(); // Remove leading/trailing spaces
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key]
          .replace(/<[^>]*>/g, "")
          .replace(/[<>]/g, "")
          .trim();
      }
    });
  }

  next();
};

module.exports = { sanitizeInput };
