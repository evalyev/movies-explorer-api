/* eslint-disable consistent-return */
const bctypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkQueryOfNull } = require('../utils/checkQueryOfNull');
const ConflictError = require('../errors/conflict-err');

module.exports.getThisUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => checkQueryOfNull(user, req, res))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return User.findByIdAndUpdate(req.user._id, { name, email },
          { new: true, runValidators: true });
      } if (user._id.equals(req.user._id)) {
        return User.findByIdAndUpdate(req.user._id, { name, email },
          { new: true, runValidators: true });
      }
      next(new ConflictError('Error. Conflict request'));
    })
    .then((user) => checkQueryOfNull(user, req, res))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bctypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(200).send({
      name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError(err.message));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'strict',
        })
        .send({
          name: user.name, email: user.email,
        });
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res, next) => {
  res.cookie('jwt', {}, {
    maxAge: 0,
  })
    .end();
  next();
};
