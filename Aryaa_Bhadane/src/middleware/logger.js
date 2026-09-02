/**
 * HTTP request logging middleware
 * Logs method, URL, timestamp, and user ID (if authenticated) for every incoming request.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.user ? req.user.userId : 'Anonymous';
  const method = req.method;
  const url = req.originalUrl || req.url;

  console.log(`[${timestamp}] ${method} ${url} - User: ${userId}`);
  next();
};

module.exports = logger;
