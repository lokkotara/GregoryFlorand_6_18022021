const express = require('express');
const router = express.Router();//Permet de charger le middleware niveau routeur

const userCtrl = require('../controllers/user');//On appelle la logique métier de nos routes

router.post('/signup', userCtrl.signup);//Permet de créer un nouvel utilisateur
router.post('/login', userCtrl.login);//Connecte un utilisateur existant

module.exports = router;