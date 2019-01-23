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
  if (description === undefined || picture_url === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });
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
    const obj = data.posts;
    res.json({ success: true, data: obj });
  });
});

// Logged in user will delete post with postId
router.delete('/posts/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;
  User.deletePost(userId, postId, (err, data) => {
    if (err) return res.status(400).json({ success: false, msg: 'There was some error : ' + err });
    res.end();
  });
});

// This user will now like post with postId
router.put('/like/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const loggedInUserId = req.user._id;
  if (userId === undefined || postId === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });

  User.likePost(loggedInUserId, userId, postId, (err, data) => {
    if (err) res.status(400).json({ success: false, msg: 'There was some error ' + err });
    res.json({ success: true, msg: 'Successfully liked the post' });
  });
});

// This user will now not like post with postId that is it reverts back to nothing
router.delete('/like/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const loggedInUserId = req.user._id;
  if (userId === undefined || postId === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });
  User.deleteLikePost(loggedInUserId, userId, postId, (err, data) => {
    if (err) res.status(400).json({ success: false, msg: 'There was some error ' + err });
    res.json({ success: true, msg: 'Successfully unliked the post' });
  });
});

// This user will now dislike post with postId
router.put('/dislike/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const loggedInUserId = req.user._id;
  if (userId === undefined || postId === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });

  User.disLikePost(loggedInUserId, userId, postId, (err, data) => {
    if (err) res.status(400).json({ success: false, msg: 'There was some error ' + err });
    res.json({ success: true, msg: 'Successfully disliked the post' });
  });
});

// This user will now not dislike post with postId that is it reverts back to nothing
router.delete('/dislike/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const loggedInUserId = req.user._id;
  if (userId === undefined || postId === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });
  User.deleteDisLikePost(loggedInUserId, userId, postId, (err, data) => {
    if (err) res.status(400).json({ success: false, msg: 'There was some error ' + err });
    res.json({ success: true, msg: 'Successfully un-disliked the post' });
  });
});

// Get all likedPosts for loggedin user
router.get('/likes', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getLikes(userId, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.likedPosts.length;
    return res.status(200).send(obj);
  });
});

// Get all disLikedPosts for loggedin user
router.get('/dislikes', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getDisLikes(userId, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.disLikedPosts.length;
    return res.status(200).send(obj);
  });
});

// Get all pictures for loggedin user
router.get('/pictures', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getPictures(userId, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.pictures.length;
    return res.status(200).send(obj);
  });
});

// Get list of uses who loggedin user is following
router.get('/following', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getFollowing(userId, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    let obj = JSON.parse(JSON.stringify(data));
    obj.count = data.following.length;
    return res.status(200).send(obj);
  });
});

// Return list of users who follow loggedin user
router.get('/followers', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  User.getFollowers(userId, limit, offset, (err, data) => {
    if (err) return res.status(404).send({ success: false, msg: 'Failed to find user with id: ' + id });
    const obj = JSON.parse(JSON.stringify(data));
    obj.count = data.followers.length;
    return res.status(200).send(obj);
  });
});

// This user will follow user with id targetUserId
router.put('/following/:targetUserId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const targetUserId = req.params.targetUserId;

  User.follow(userId, targetUserId, (err, data) => {
    if (err) return res.status(400).json({ success: false, msg: 'Unable to follow  user with id ' + targetUserId });
    return res.json({ success: true, msg: 'Successfully followed user with id ' + targetUserId });
  });
});

// This user will now unfollow user with id targetUserId
router.delete('/following/:targetUserId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const targetUserId = req.params.targetUserId;

  User.unfollow(userId, targetUserId, (err, data) => {
    if (err) return res.status(400).json({ success: false, msg: 'Unable to unfollow  user with id ' + targetUserId });
    return res.json({ success: true, msg: 'Successfully unfollowed user with id ' + targetUserId });
  });
});

// This user will create a comment on userId' postId'
router.post('/comment', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user._id;
  const { userId: targetUserId, postId, content } = req.body;
  const comment = { content };

  if (postId === undefined || targetUserId === undefined)
    return res.json({ success: false, msg: 'Please pass correct userId and postId' });

  User.comment(userId, targetUserId, postId, comment, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    res.end();
  });
});
module.exports = router;
