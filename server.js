const http = require('http');//Permet d'utiliser le serveur http
const app = require('./app');

//Permet de retourner un port valide, qu'il soit obtenu sous la forme du nombre ou d'une chaîne de caractères
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);//On indique quel port utiliser dans app.js

//Permet de renvoyer les erreurs afin de les traiter correctement
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();//Définit l'addresse de connexion au serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);//Construit le serveur avec le protocole http et en utilisant app.js

server.on('error', errorHandler);//Lance le gestionnaire d'erreurs
server.on('listening', () => {//lance le serveur et affiche les infos de connexion dans la console
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);