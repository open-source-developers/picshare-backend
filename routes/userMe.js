const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const _ = require('lodash');

// Return entire info about this user
router.get('', passport.authenticate('jwt', { session: false }), (req, res) => {
  const a = _.omit(JSON.parse(JSON.stringify(req.user)), ['password', '__v']);
  console.log(a);
  res.end();
});

module.exports = router;
