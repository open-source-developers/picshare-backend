const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Post Schema
const PostSchema = mongoose.Schema({
  description: String,
  likes_count: Number,
  dislikes_count: Number,
  likes: [],
  dislikes: [],
  comments_count: Number,
  comments: [],
  posted_at: Number,
  picture_url: String
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

module.exports.schema = PostSchema;
