const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, defaultValue: 0 },
  dislikes: { type: Number, required: true, defaultValue: 0 },
  usersLiked: { type: Array, required: true, defaultValue: [] },
  usersDisliked: { type: Array, required: true, defaultValue: [] }
})

module.exports = mongoose.model('Sauce', sauceSchema);