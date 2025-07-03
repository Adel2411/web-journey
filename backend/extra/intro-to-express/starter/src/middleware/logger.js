
const logger = (req, res, next) => {
  // On crée une chaîne de log contenant :
  // - la date et l'heure actuelles
  // - la méthode HTTP (GET, POST, PUT, DELETE...)
  // - l'URL demandée (ex: /posts, /posts/1)
  // - les en-têtes HTTP (headers) de la requête
  // - le corps de la requête (body), souvent utilisé avec POST ou PUT
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Headers: ${JSON.stringify(
    req.headers
  )} - Body: ${JSON.stringify(req.body)}`;
  console.log(log);
  next();
};

export default logger;

/** the reason is :  Affiche chaque requête dans la console */