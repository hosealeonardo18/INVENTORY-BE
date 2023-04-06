const express = require('express');
const router = express.Router();
const UsersRouter = require('./UsersRouter');

router.use('/user', UsersRouter);

module.exports = router;