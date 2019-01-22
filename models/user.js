const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Post = require('../models/post');
const PostSchema = Post.schema;

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  birthDate: Date,
  joined_at: Date,
  roles: [String],
  avatar_url: String,
  cover_url: String,
  description: {
    type: String,
    minLength: 0,
    maxLength: 100
  },
  followers: [ObjectId],
  following: [ObjectId],
  pictures: [String],
  posts: [PostSchema],
  likedPosts: [{ _id: false, userId: ObjectId, postId: ObjectId }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getFollowers = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, 'followers', { skip: offset, limit }, callback);
};

module.exports.getFollowing = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, 'following', { skip: offset, limit }, callback);
};

module.exports.getPictures = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, 'pictures', { skip: offset, limit }, callback);
};

module.exports.getPosts = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, { posts: { $slice: [offset, limit] } }, callback);
};

module.exports.getLikes = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, 'likes', { skip: offset, limit }, callback);
};

module.exports.getDislikes = (id, limit = 20, offset = 0, callback) => {
  User.findById(id, 'posts.dislikes', { skip: offset, limit }, callback);
};

module.exports.likePost = (loggedInUserId, targetUserId, postId, callback) => {
  User.find({ _id: targetUserId, posts: { $elemMatch: { _id: postId } } }, (err, data) => {
    if (err) {
      callback(err, data);
    }
    User.findOneAndUpdate(
      { _id: loggedInUserId },
      {
        $addToSet: {
          likedPosts: { userId: targetUserId, postId }
        }
      },
      { new: true },
      callback
    );
  });
};

module.exports.deleteLikePost = (loggedInUserId, targetUserId, postId, callback) => {
  User.findOneAndUpdate({ _id: loggedInUserId }, { $pull: { likedPosts: { userId: targetUserId, postId } } }, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  const query = {
    username: username
  };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getAll = (limit = 20, offset = 0, callback) => {
  User.find({}, null, { skip: offset, limit }, callback);
};

module.exports.addPost = (post, userId, callback) => {
  post['posted_at'] = Math.round(new Date().getTime());
  User.findOneAndUpdate(
    { _id: userId },
    {
      $push: {
        posts: post
      }
    },
    { new: true },
    callback
  );
};

module.exports.deletePost = (userId, postId, callback) => {
  User.findOneAndUpdate({ _id: userId }, { $pull: { posts: { _id: postId } } }, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
