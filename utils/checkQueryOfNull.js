const NotFoundError = require('../errors/not-found-err');

// eslint-disable-next-line consistent-return
module.exports.checkQueryOfNull = (data, req, res, next) => {
  try {
    if (data.length === 0) {
      return next(new NotFoundError('Not found.'));
    }
  } catch (err) {
    if (data === null) {
      return next(new NotFoundError('Not found.'));
    }
  }

  res.send({ data });
};
