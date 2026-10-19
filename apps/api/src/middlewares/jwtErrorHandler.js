const response = require("../network/response");

const handleJWTError = (err, req, res, next) => {
  if (err) {
    response.error(req, res, "Invalid token", 401);
  } else {
    next();
  }
};

module.exports = handleJWTError;
