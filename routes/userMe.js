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
  res.end();
});

// Current logged in user will now create new post
router.post('/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const { description, picture_url } = req.body;
  const post = { description, picture_url };
  User.addPost(post, userId, (err, data) => {
    if (err) return res.status(400).json({ success: false, msg: 'There was some error : ' + err });
    const obj = data.posts[data.posts.length - 1];
    res.status(200).json({ success: true, data: obj });
  });
});

// Retrieve all posts made by current user
router.get('/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getPosts(userId, limit, offset, (err, data) => {
    if (err) return res.status(400).json({ success: false, msg: 'There was some error : ' + err });
    console.log(data);
    const obj = data.posts;
    res.json({ success: true, data: obj });
  });
});
module.exports = router;
