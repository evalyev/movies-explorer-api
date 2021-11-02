const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('ПОДКЛЮЧИЛИСЬ К БД');
}).catch((res) => {
  console.log(`Ошибка: ${res.message}`);
});

app.use('/users', require('./routes/users'));


// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});