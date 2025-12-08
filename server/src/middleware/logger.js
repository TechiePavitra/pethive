/**
 * Request logging middleware
 * Logs all incoming requests for debugging
 */

const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`→ ${req.method} ${req.path}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

module.exports = logger;
