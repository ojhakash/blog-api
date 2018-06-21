const HttpError = require("http-error-constructor");

var { User } = require("../models/users.model");

var authenticate = async (req, res, next) => {
  var token = req.header("x-auth");
  try {
    if (!token) {
      throw new HttpError(400, "token is required !");
    }

    const user = await User.findByToken(token).exec();

    if (!user) {
      throw new HttpError(403, "token validation failed!");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(e.status).send(e);
  }
};

module.exports = { authenticate };
