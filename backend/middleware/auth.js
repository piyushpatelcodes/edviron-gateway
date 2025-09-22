const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: "Invalid token", error: err });
  }
}

module.exports = authMiddleware;
