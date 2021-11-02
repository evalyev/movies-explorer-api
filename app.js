/* eslint-disable no-console */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const checkErrors = require('./middlewares/check-errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { options } = require('./utils/constants');

const { login, createUser } = require('./controllers/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('ПОДКЛЮЧИЛИСЬ К БД');
}).catch((res) => {
  console.log(`Ошибка: ${res.message}`);
});

app.use(cors(options));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

app.use(errors());

app.use(checkErrors);

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
