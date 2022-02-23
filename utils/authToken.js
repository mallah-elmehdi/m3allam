const jwt = require("jsonwebtoken");

const authToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.createSendToken = (user) => {
  const token = authToken(user._id);
  return token;
};

exports.cookieOptions = {
  httpOnly: true,
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
  ),
};

