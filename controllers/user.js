const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const User =require('../models/User');

const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema
    .is().min(4)         //min 4 caractères
    .is().max(20)      //max 20 caractères
    .has().digits(1)   // min 1 chiffre
    .has().not().spaces()   // ne doit pas contenir d'espace
    .has().uppercase(1)    // min 1 caractère majuscule
    .has().lowercase(1)    // min 1 caractère minuscule

function mask(str, mask=true) {
  const ref = str;
  let arobase = false;
  let newStr = "";
  str = str.split("");
  for (let i = 0, size = str.length; i < size; i++) {
    if (str[i] === "@") {
      arobase = true;
      newStr += str[i];
      continue;
    }
    if (str[i] === "." && arobase) {
      return newStr+ref.slice(i);
    }
    if (mask) newStr += String.fromCharCode(str[i].charCodeAt() + 9);
    else newStr += String.fromCharCode(str[i].charCodeAt() - 9);
  }
}

exports.signup = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    res.status(401).json({ message: 'Mot de passe insuffisant' }); 
      return false;
  }
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: mask(req.body.email),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: mask(req.body.email)})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};