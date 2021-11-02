const bctypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkQueryOfNull } = require('../utils/checkQueryOfNull');

module.exports.getThisUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => checkQueryOfNull(user, req, res))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => checkQueryOfNull(user, req, res))
    .catch((err) => next(err));
};
