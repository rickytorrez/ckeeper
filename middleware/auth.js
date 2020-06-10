const jwt = require('jsonwebtoken');
const config = require('config');

// check if there's a token in the header
module.exports = function (req, res, next) {
  // get token from the header
  const token = req.header('x-auth-token');

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // if there's a token , verify it
  try {
    // const decoded = jwt.verify(token, config.get('jwtSecret'));
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // take the user out of the token and set it equal to the req.user
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
