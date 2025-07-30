const activeSessions = new Map();

const sessionManager = (req, res, next) => {
  // Add session tracking to login response
  const originalJson = res.json;
  res.json = function (data) {
    if (data.success && data.user && req.path === "/api/signin") {
      // Create session for successful login
      const sessionId = Date.now().toString() + Math.random().toString(36);
      activeSessions.set(sessionId, {
        userId: data.user.email,
        loginTime: new Date(),
        lastActivity: new Date(),
      });

      // Add session info to response
      data.sessionId = sessionId;
    }
    return originalJson.call(this, data);
  };

  next();
};

const checkSession = (req, res, next) => {
  const sessionId = req.headers["session-id"];

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Session ID required",
    });
  }

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }

  // Update last activity
  session.lastActivity = new Date();
  next();
};

module.exports = { sessionManager, checkSession, activeSessions };
