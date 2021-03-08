const Sauce = require('../models/Sauce'); //On importe le modèle de sauce
const fs = require('fs'); //système de gestion de fichier de Node

//Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;//retire l'id généré automatiquement par MongoDb
  const sauce = new Sauce({
    ...sauceObject,//Utilise l'opérateur spread pour copier les infos du corps de la requête
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//On génère l'url par rapport à son nom de fichier
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()//Sauvegarde la nouvelle sauce dans la bdd
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
  .catch(error => res.status(400).json({ error }));
};

//Modifier les infos d'une sauce
exports.modifySauce = (req, res, next) => {
  //Si une nouvelle image est reçue dans la requête
  if (req.file) {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const fileName = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${fileName}`, (err => {//On supprime l'ancienne image
                if (err) console.log(err);
                else {
                    console.log("Image supprimée: " + fileName);
                }
            }))
        })
  } 
  //On ajoute les nouvelles informations à l'objet sauce
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})//et on met à jour la base de données
  .then(() => res.status(200).json( 'message: Sauce modifiée !'))
  .catch(error => res.status(404).json({ error }));
}

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})//Trouve la sauce correspondant à l'id
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {//on supprime l'image du dossier images
        Sauce.deleteOne({ _id: req.params.id })//et supprime la sauce de la collection
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
}

//Voter pour une sauce
exports.voteSauce = (req, res, next) => {
  const like = req.body.like;
  const user = req.body.userId;
  Sauce.findOne({_id: req.params.id})//On sélectionne la sauce par son id
    .then((sauce) => {
      //Définit le statut de like
      switch(like) {
        case 1://s'il est égale à 1 et que le tableau usersLiked ne contient pas déjà l'id
          if(!sauce.usersLiked.includes(user)){
            Sauce.updateOne({_id: req.params.id}, {
              $inc: {likes: 1},//on ajoute 1 au likes
              $push: {usersLiked: user}//et on ajoute l'id de l'utilisateur au tableau usersLiked
            }, {_id: req.params.id})
            .then(() => res.status(200).json({message: 'Vote positif !'}))
            .catch(error => res.status(400).json({error}))
          }
          break;
        case -1://s'il est égale à -1 et que le tableau usersDisliked ne contient pas déjà l'id de l'utilisateur
          if(!sauce.usersDisliked.includes(user)){
            Sauce.updateOne({_id: req.params.id}, {
              $inc: {dislikes: 1},//on ajoute 1 à dislikes
              $push: {usersDisliked: user}//et on ajoute l'userId au tableau usersDisliked
            }, {_id: req.params.id})
            .then(() => res.status(200).json({message: 'Vote négatif !'}))
            .catch(error => res.status(400).json({error}))
          }
          break;
        default://s'il est égale à 0
          if (sauce.usersLiked.includes(user)) {//et que usersLiked contient l'userId
            Sauce.updateOne({_id: req.params.id}, {
                $inc: {likes: -1},//on retire 1 à likes
                $pull: {usersLiked: user}//et on sort l'id du tableau usersLiked
            }, {_id: req.params.id})
                .then(() => res.status(200).json({message: 'Vote réinitialisé !'}))
                .catch(error => res.status(400).json({error}))
          } else if (sauce.usersDisliked.includes(user)) {//et que usersDisliked contient l'userId
            Sauce.updateOne({_id: req.params.id}, {
                $inc: {dislikes: -1},//on retire 1 à dislikes
                $pull: {usersDisliked: user}//et on sort l'id du tableau usersDisliked
            }, {_id: req.params.id})
                .then(() => res.status(200).json({message: 'avis retiré!'}))
                .catch(error => res.status(400).json({error}))
          }
      }
    })
    .catch(error => res.status(400).json({ error }));
};

// Récupérer une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//On récupère la sauce correspondant à l'id
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()//On récupère toutes les sauces dans la collection
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

