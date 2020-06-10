const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/auth
// @desc    get logged in user
// @access  private - protected route with auth
router.get('/', auth, async (req, res) => {
  try {
    // get user from db
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/auth
// @desc    auth user in and get token
// @access  public
router.post(
  '/',
  [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please provide a password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // check comparison of pw in the body and hashed pw in db
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // create payload - object we want to send in the token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;
