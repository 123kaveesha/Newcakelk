// Server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Baker = require('../models/Baker');

// 🛡️ Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const baker = await Baker.findOne({ _id: decoded.id, 'tokens.token': token });

    if (!baker) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    req.token = token;
    req.baker = baker;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Please authenticate' });
  }
};

module.exports = auth;
