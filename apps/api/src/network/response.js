function success(req, res, message = "", status = 200) {
  res.status(status).json({
    status: status,
    result: message,
  });
}

function error(req, res, message = "Internal server error", status = 500) {
  res.status(status).json({
    status: status,
    message: message,
  });
}

module.exports = { success, error };
