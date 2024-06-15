// middleware/auth.js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ result: 'error', message: 'No token, authorization denied' });
  }
  // Token validation logic here
  next();
};

module.exports = auth;
