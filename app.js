const express = require('express');//Importe le framework express pour node.js
const helmet = require("helmet");//Importe helmet pour sécuriser les en-têtes des requêtes
const mongoose = require('mongoose');//Importe mongoose qui permet la création de modèle pour mongoDb
const mongoSanitize = require('express-mongo-sanitize');//Sert à empêcher l'injection de code dans les champs utilisateurs
const path = require('path');//Permet d'accéder aux chemins d'accès des fichiers
const dotenv = require('dotenv').config();//Permet de créer un environnement de variables
const Ddos = require('ddos');
const ddos = new Ddos({burst:10, limit:15});

const authenticationLimiter = require('./middleware/authenticationLimiter');
const sauceRoutes = require('./routes/sauce');//Importe le routeur pour les sauces
const userRoutes = require('./routes/user');//Importe le routeur pour les utilisateurs

const app = express();//Applique le framework express
app.use(helmet());//Met en place les sous-plugins de helmet
app.use(ddos.express);

//Connecte l'API à la base de données mongoDB grâce à mongoose, en utilisant les identifiants stockés dans le fichier .env
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.uxdfw.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//définit les paramètres d'en-tête
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');//permet l'accès à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//Autorise les en-têtes spécifiées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//Permet l'utilisation des méthodes définies
  next();
});

//Permet de récupérer le corps de la requête au format json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Nettoie les champs utilisateurs des tentatives d'injection de code commençant par $ ou "."
app.use(mongoSanitize())

app.use('/images', express.static(path.join(__dirname, 'images')));//Permet de servir les fichiers statiques, présents dans le dossier images

app.use('/api/sauces', sauceRoutes);//Sert les routes concernant les sauces pour toutes demande vers le endpoint /api/sauces
app.use('/api/auth',authenticationLimiter, userRoutes);//Sert les routes concernant les utilisateurs pour toutes demande vers le endpoint /api/auth

module.exports = app;