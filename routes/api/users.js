const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');
const UserInfo = require('../../models/UserInfo');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });
      let role;
      if(req.body.role === "admin"){
        role = 2;
      } else if(req.body.role === "superadmin"){
        role = 3;
      } else {
        role = 1;
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        role: role
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          new User(newUser).save().then(profile => res.json(profile))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);
        // Check Validation
        if (!isValid) {
          return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;
        // Find user by email
        User.findOne({ email }).then(user => {
          // Check for user
          if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
          }
          bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              // User Matched
              const payload = { id: user.id, name: user.name, avatar: user.avatar, role: user.role }; // Create JWT Payload
              // Sign Token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                }
              );
            } else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
          });
        });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
router.post('/register/userinfo', (req, res) => {
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  UserInfo.findOne({ usrid: req.body.userid }).then(userinfo => {
    if (user) {
      // errors.userinfo = 'UserInfo already exists';
      return res.json(userinfo);
    } else {
      const newUser = new UserInfo({
        userid: req.body.userid,
      });
      new UserInfo(newUser).save().then(profile => res.json(profile))
          .catch(err => console.log(err));
    }
  });
});

module.exports = router;
