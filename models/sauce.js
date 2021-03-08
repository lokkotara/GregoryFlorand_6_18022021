//On crée un schéma de données grâce à mongoose avec les propriétés désirées
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, match:/^[^@&*";?#/\$=`<>]+$/g },
  manufacturer: { type: String, required: true, match:/^[^@&*";?#/\$=`<>]+$/g  },
  description: { type: String, required: true, match:/^[^@&*";?#/\$=`<>]+$/g  },
  mainPepper: { type: String, required: true, match:/^[^@&*";?#/\$=`<>]+$/g  },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, defaultValue: 0 },
  dislikes: { type: Number, required: true, defaultValue: 0 },
  usersLiked: { type: Array, required: true, defaultValue: [] },
  usersDisliked: { type: Array, required: true, defaultValue: [] }
})

//Puis on l'exporte en tant que modèle
module.exports = mongoose.model('Sauce', sauceSchema);