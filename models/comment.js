const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
// Comment Schema
const CommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  likes_count: Number,
  dislikes_count: Number,
  likes: [],
  dislikes: [],
  commented_at: Number,
  userId: ObjectId,
  _id: {
    type: ObjectId,
    auto: true
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

module.exports.schema = CommentSchema;
