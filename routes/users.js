const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getThisUser, updateUser } = require('../controllers/users');

router.get('/users/me', getThisUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
