const rateLimit = require("express-rate-limit");

const sauceLimiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 30 secondes
  max: 1, // limite la création et la modification d'une sauce à 1 demande toutes les 30 secondes
  message : "Veuillez attendre 30 secondes entre chaque modification !"
});

module.exports = sauceLimiter;
