const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import des routes
const produitsRoutes = require('./routes/produits');
const produitsSensiblesRoutes = require('./routes/produitsSensibles');
const historiqueRoutes = require('./routes/historique');
const statistiquesRoutes = require('./routes/statistiques');
const categoriesRoutes = require('./routes/categories');

// Utilisation des routes
app.use('/api', produitsRoutes);
app.use('/api', produitsSensiblesRoutes);
app.use('/api', historiqueRoutes);
app.use('/api', statistiquesRoutes);
app.use('/api', categoriesRoutes);

// Route de santé globale
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    // Statistiques générales
    const Produit = require('./models/Produit');
    const ProduitSensible = require('./models/ProduitSensible');
    
    const totalProduits = await Produit.count();
    const totalSensibles = await ProduitSensible.count();
    const totalCategories = await Produit.count({
      distinct: true,
      col: 'categorie'
    });
    
    res.json({ 
      status: 'Service Produits Médicaux en marche', 
      database: 'Connecté',
      statistiques: {
        total_produits: totalProduits,
        total_sensibles: totalSensibles,
        total_categories: totalCategories
      },
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Service Produits en marche', 
      database: 'Erreur connexion',
      error: error.message 
    });
  }
});

async function init(options = { log: true }) {
  const { log } = options;
  try {
    await sequelize.authenticate();
    if (log) console.log('✅ Connecté à la base de données SQLite');

    await sequelize.sync();
    if (log) console.log('✅ Tables synchronisées');

    // Comptage / seed idempotent
    const Produit = require('./models/Produit');
    const ProduitSensible = require('./models/ProduitSensible');
    
    const totalProduits = await Produit.count();
    const totalSensibles = await ProduitSensible.count();
    if (log) console.log(`📊 Base de données : ${totalProduits} produits normaux, ${totalSensibles} produits sensibles`);
  } catch (error) {
    if (options.log) console.error("Erreur d'initialisation:", error);
    throw error;
  }
}

// Si ce module est exécuté directement (node backend/app.js), on initialise puis on écoute.
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  (async () => {
    try {
      await init({ log: true });
      app.listen(PORT, () => {
        console.log(`🚀 Service Produits Médicaux démarré sur le port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`💊 API Produits Normaux: http://localhost:${PORT}/api/produits`);
        console.log(`🔒 API Produits Sensibles: http://localhost:${PORT}/api/produits-sensibles`);
      });
    } catch (err) {
      console.error('Erreur au démarrage :', err);
      process.exit(1);
    }
  })();
}

module.exports = { app, init, sequelize };