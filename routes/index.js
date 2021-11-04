const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.use(require('./auth'));

router.use(auth);

router.use(require('./users'));
router.use(require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Not found'));
});

module.exports = router;
