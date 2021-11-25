const Movie = require('../models/movie');
const { checkQueryOfNull } = require('../utils/checkQueryOfNull');
const { checkPermissionsMovie } = require('../utils/checkPermissions');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMyFilms = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => checkQueryOfNull(movies, req, res, next))
    .catch((err) => next(err));
};

module.exports.createFilm = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.removeFilm = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError('Movie not found'));
      }
      if (!checkPermissionsMovie(movie, req.user)) {
        return Promise.reject(new ForbiddenError('Forbidden error'));
      }
      return Movie.findOneAndRemove({ movieId: req.params.movieId });
    })
    .then((movie) => checkQueryOfNull(movie, req, res, next))
    .catch((err) => next(err));
};
