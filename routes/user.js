const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const _ = require('lodash');

// Return all users
router.get('', (req, res, next) => {
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getAll(limit, offset, (err, data) => {
    const arr = data.map(user => {
      return _.omit(JSON.parse(JSON.stringify(user)), ['password', '__v']);
    });
    res.status(200).send(arr);
  });
});

// Return specific user
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.getUserById(id, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });

    const obj = _.omit(JSON.parse(JSON.stringify(data)), ['password', '__v']);
    return res.status(200).send({ success: true, user: data });
  });
});

// Return list of users who you follow
router.get('/:id/followers', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getFollowers(id, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    const obj = JSON.parse(JSON.stringify(data));
    obj.count = data.followers.length;
    return res.status(200).send(obj);
  });
});

// Return list of users you are following
router.get('/:id/following', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getFollowing(id, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.following.length;
    return res.status(200).send(obj);
  });
});

// Return list of pictures for this user
router.get('/:id/pictures', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getPictures(id, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.pictures.length;
    return res.status(200).send(obj);
  });
});

// Return list of posts for this user
router.get('/:id/posts', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getPosts(id, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.posts.length;
    return res.status(200).send(obj);
  });
});

// Return the list of likes for this user - recheck once
router.get('/:id/likes', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getLikes(id, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.likes.length;
    return res.status(200).send(obj);
  });
});

// Return the list of dislikes for this user - recheck once
router.get(':id/dislikes', (req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getDislikes(id, limit, offset, (err, data) => {
    console.log(err);
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    // obj.count = data.dislikes.length;
    return res.status(200).send(obj);
  });
});

module.exports = router;
