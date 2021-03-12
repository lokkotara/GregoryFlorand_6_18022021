const rateLimit = require("express-rate-limit");

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite les requêtes d'authentification à 100 toutes les 15 minutes
  message : "vous avez dépassé la limite autorisé de 100 requêtes, veuillez attendre 15minutes"
});

module.exports = authenticationLimiter;
