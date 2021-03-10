const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//On extrait le token de la requête
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);//On décrypte le token grâce à la clé secrète
    const userId = decodedToken.userId;//On récupère l'userId du token décrypté 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';//Renvoie une erreur si l'id décodé de la requête ne correspond pas l'id de l'utilisateur
    } else {
      next();//Sinon, l'authentification est réussie et la suite du code peut s'exécuter
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !'});
  }
};