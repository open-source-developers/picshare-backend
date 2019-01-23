const mongoose = require('mongoose');

// Comment Schema
const CommentSchema = mongoose.Schema({
  content: String,
  likes_count: Number,
  dislikes_count: Number,
  likes: [],
  dislikes: [],
  commented_at: Number
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

module.exports.schema = CommentSchema;
