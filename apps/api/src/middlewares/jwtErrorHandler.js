import * as response from "../network/response.js";

const handleJWTError = (err, req, res, next) => {
  if (err) {
    response.error(req, res, "Invalid token", 401);
  } else {
    next();
  }
};

export default handleJWTError;
