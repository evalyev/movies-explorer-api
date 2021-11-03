const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMyFilms, createFilm, removeFilm } = require('../controllers/movies');
const { regexUrl } = require('../utils/constants');

router.get('/', getMyFilms);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexUrl),
    trailer: Joi.string().required().pattern(regexUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(regexUrl),
    owner: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createFilm);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), removeFilm);

module.exports = router;
