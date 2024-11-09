const Encore = require("@symfony/webpack-encore");

//Configurez manuellement l'environnement d'exécution s'il n'est pas déjà configuré par la commande "encore".
//C'est utile lorsque vous utilisez des outils qui s'appuient sur le fichier webpack.config.js.
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || "dev");
}

Encore
  //répertoire où les actifs compilés seront stockés
  .setOutputPath("public/build/")
  //chemin public utilisé par le serveur web pour accéder au chemin de sortie
  .setPublicPath("/build")
  //nécessaire uniquement pour le déploiement du CDN ou du sous-répertoire
  //.setManifestKeyPrefix('build/')

  /*
   *CONFIG D'ENTRÉE
   *
   *Chaque entrée donnera lieu à un fichier JavaScript (par exemple app.js)
   *et un fichier CSS (par exemple app.css) si votre JavaScript importe du CSS.
   */
  .addEntry("app", "./assets/app.ts") //Fichier JS/TS
  .addStyleEntry("styles", "./assets/styles/app.scss")

  // Activer Stimulus (important si vous utilisez le Stimulus bundle de Symfony)
  .enableStimulusBridge("./assets/controllers.json")

  //Activer TypeScript et Sass
  .enableTypeScriptLoader()
  //.enableSassLoader()
  .enableSassLoader((options) => {
    options.implementation = require("sass"); //Utilise Dart Sass
  })

  //Lorsqu'il est activé, Webpack "scinde" vos fichiers en morceaux plus petits pour une plus grande optimisation.
  .splitEntryChunks()

  //nécessitera une balise de script supplémentaire pour runtime.js
  //mais c'est probablement ce que vous voulez, à moins que vous ne construisiez une application d'une seule page
  .enableSingleRuntimeChunk()

  /*
   *CONFIGURATION DES FONCTIONS
   *
   *Activez et configurez d'autres fonctionnalités ci-dessous. Pour un plein
   *liste des fonctionnalités, voir :
   *https://symfony.com/doc/current/frontend.html#adding-more-features
   */
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  .enableSourceMaps(!Encore.isProduction())
  //active les noms de fichiers hachés (par exemple app.abc123.css)
  .enableVersioning(Encore.isProduction())

  //configure Babel
  //.configureBabel((config) => {
  //config.plugins.push('@babel/a-babel-plugin');
  //})

  //active et configure les polyfills @babel/preset-env
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = "usage";
    config.corejs = "3.23";
  });

//décommentez si vous utilisez React
//.enableReactPreset()

//décommentez pour obtenir les attributs Integrity="..." sur vos balises de script et de lien
//nécessite WebpackEncoreBundle 1.4 ou supérieur
//.enableIntegrityHashes(Encore.isProduction())

//décommentez si vous rencontrez des problèmes avec un plugin jQuery
//.autoProvidejQuery()

module.exports = Encore.getWebpackConfig();


