import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  console.log("token")
  const token = req.cookies.access_token;
  console.log('asdsd')
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};
