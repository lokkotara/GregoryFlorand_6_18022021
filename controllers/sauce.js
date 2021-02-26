const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
  .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const fileName = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${fileName}`, (err => {
                if (err) console.log(err);
                else {
                    console.log("\nDeleted file: " + fileName);
                }
            }))
        })
  } 
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
  .then(() => res.status(200).json( 'message: Sauce modifiée !'))
  .catch(error => res.status(404).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
}

exports.voteSauce = (req, res, next) => {
  const like = req.body.like;
  const user = req.body.userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      switch(like) {
        case 1:
          if(!sauce.usersLiked.includes(user)){
            Sauce.updateOne({_id: req.params.id}, {
              $inc: {likes: 1},
              $push: {usersLiked: user}
            }, {_id: req.params.id})
            .then(() => res.status(200).json({message: 'Vote positif !'}))
            .catch(error => res.status(400).json({error}))
          }
          break;
        case -1:
          if(!sauce.usersDisliked.includes(user)){
            Sauce.updateOne({_id: req.params.id}, {
              $inc: {dislikes: 1},
              $push: {usersDisliked: user}
            }, {_id: req.params.id})
            .then(() => res.status(200).json({message: 'Vote négatif !'}))
            .catch(error => res.status(400).json({error}))
          }
          break;
        default:
          if (sauce.usersLiked.includes(user)) {
            Sauce.updateOne({_id: req.params.id}, {
                $inc: {likes: -1},
                $pull: {usersLiked: user}
            }, {_id: req.params.id})
                .then(() => res.status(200).json({message: 'Vote réinitialisé !'}))
                .catch(error => res.status(400).json({error}))
          } else if (sauce.usersDisliked.includes(user)) {
            Sauce.updateOne({_id: req.params.id}, {
                $inc: {dislikes: -1},
                $pull: {usersDisliked: user}
            }, {_id: req.params.id})
                .then(() => res.status(200).json({message: 'avis retiré!'}))
                .catch(error => res.status(400).json({error}))
          }
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

