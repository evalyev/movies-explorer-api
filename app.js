const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const checkErrors = require('./middlewares/check-errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { options } = require('./utils/constants');

const { NODE_ENV, MONGODB } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect(`mongodb://localhost:27017/${NODE_ENV === 'production' ? MONGODB : 'moviesdb'}`, {
  useNewUrlParser: true,
}).then(() => {
  console.log('ПОДКЛЮЧИЛИСЬ К БД');
}).catch((res) => {
  console.log(`Ошибка: ${res.message}`);
});

app.use(cors(options));

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(checkErrors);

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
