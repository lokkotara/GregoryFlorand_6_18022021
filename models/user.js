const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');//Nous permet de vérifier que le champ avec la propriété unique n'est pas déjà présent dans la bdd

//On crée un schéma de données grâce à mongoose avec les propriétés désirées
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//et on applique unique-validator au schema
userSchema.plugin(uniqueValidator);

//Puis on l'exporte en tant que modèle
module.exports = mongoose.model('User', userSchema);