const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthError('Error. You need to log in'), req, res, next);
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    // eslint-disable-next-line no-undef
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new AuthError('Error. You need to log in'), req, res, next);
  }

  req.user = payload;
  next();
};
