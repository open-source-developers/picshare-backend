const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Post Schema
const PostSchema = mongoose.Schema({
  description: String,
  picture_url: String,
  likes: [],
  dislikes: [],
  comments: [],
  likes_count: {
    type: Number,
    default: 0
  },
  dislikes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  },
  posted_at: Number
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

module.exports.schema = PostSchema;
