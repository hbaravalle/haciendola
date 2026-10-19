module.exports = (req, res, next) => {
  const protocol = req.protocol;
  const host = req.get("host");
  req.completeUrl = `${protocol}://${host}/api${req.baseUrl}`;
  next();
};
