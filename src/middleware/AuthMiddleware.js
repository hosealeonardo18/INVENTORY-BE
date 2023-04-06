const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      let decode = jwt.verify(token, process.env.SECRETE_KEY_JWT)
      req.payload = decode
      next()

    } else {
      return res.status(401).json({
        message: 'Unauthorized, Please provide valid token'
      })
    }
  } catch (error) {
    console.log(error);
    if (error && error.name === 'JsonWebTokenError') {
      next(new createError(400, 'Token Invalid!'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(new createError(400, 'Token Expired!'))
    } else {
      next(new createError(400, 'Token Not Active!'))
    }
  }
}

module.exports = {
  protect
}