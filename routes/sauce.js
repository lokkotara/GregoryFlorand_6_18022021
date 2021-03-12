const express = require('express');
const router = express.Router();//Permet de charger le middleware niveau routeur

const sauceCtrl = require('../controllers/sauce');//On appelle la logique métier de nos routes
const sauceLimiter = require('../middleware/sauceLimiter');
const auth = require('../middleware/auth');//On appelle le middleware d'authentification
const multer = require('../middleware/multer-config');//et celui pour la gestion des images

router.post('/', auth, sauceLimiter, multer, sauceCtrl.createSauce);//Permet de créer une sauce
router.put('/:id', auth, sauceLimiter, multer, sauceCtrl.modifySauce);//Permet de modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);//Supprime une sauce
router.post('/:id/like', auth, sauceCtrl.voteSauce);//Permet de voter pour une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);//Récupère une seule sauce
router.get('/', auth, sauceCtrl.getAllSauces);//Récupère toutes les sauces

module.exports = router;

