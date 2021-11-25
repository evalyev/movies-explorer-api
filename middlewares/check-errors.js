/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: err.message });
};
