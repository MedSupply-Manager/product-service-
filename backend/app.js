const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Produit = require('./models/Produit');
const ProduitSensible = require('./models/ProduitSensible');
const Historique = require('./models/Historique');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// =============================================
// ROUTES POUR PRODUITS NORMAUX
// =============================================

// GET - Tous les produits normaux
app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.findAll({
      order: [['nom', 'ASC']]
    });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Produit normal par ID
app.get('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await Produit.findByPk(id);
    if (produit) {
      res.json(produit);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer l'historique (avec filtres optionnels)
app.get('/api/historique', async (req, res) => {
  try {
    const { action, type_produit, limit = 50 } = req.query;
    const where = {};
    if (action) where.action = action;
    if (type_produit) where.type_produit = type_produit;
    const historique = await Historique.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    res.json(historique);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un produit normal
app.post('/api/produits', async (req, res) => {
  try {
    const { 
      nom, 
      description, 
      prix, 
      categorie, 
      sous_categorie,
      quantite, 
      seuil_alerte, 
      image_url,
      necessite_ordonnance,
      classe_therapeutique
    } = req.body;
    
    if (!nom || !prix || !categorie) {
      return res.status(400).json({ 
        error: 'Nom, prix et catégorie sont obligatoires' 
      });
    }

    const produit = await Produit.create({
      nom,
      description,
      prix,
      categorie,
      sous_categorie: sous_categorie || null,
      quantite: quantite || 0,
      seuil_alerte: seuil_alerte || 10,
      image_url: image_url || '',
      necessite_ordonnance: necessite_ordonnance || false,
      classe_therapeutique: classe_therapeutique || null
    });
      // Ajout du log
    await Historique.create({
      action: 'AJOUT',
      produit_id: produit.id,
      produit_nom: produit.nom,
      type_produit: 'NORMAL',
      details: `Produit ajouté : ${produit.nom}`
    });

    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT - Modifier un produit normal
app.put('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Produit.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedProduit = await Produit.findByPk(id);
      // Ajout du log
      await Historique.create({
        action: 'MODIFICATION',
        produit_id: updatedProduit.id,
        produit_nom: updatedProduit.nom,
        type_produit: 'NORMAL',
        details: `Produit modifié : ${updatedProduit.nom}`
      });

      res.json(updatedProduit);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un produit normal
app.delete('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await Produit.findByPk(id); // Récupérer le produit avant suppression
    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const deleted = await Produit.destroy({
      where: { id }
    });
    if (deleted) {
      // Ajout du log
      await Historique.create({
        action: 'SUPPRESSION',
        produit_id: id,
        produit_nom: produit.nom,
        type_produit: 'NORMAL',
        details: `Produit supprimé : ${produit.nom}`
      });

      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// ROUTES POUR PRODUITS SENSIBLES
// =============================================

// GET - Tous les produits sensibles
app.get('/api/produits-sensibles', async (req, res) => {
  try {
    const produits = await ProduitSensible.findAll({
      order: [['nom', 'ASC']]
    });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer l'historique (avec filtres optionnels)
app.get('/api/historique', async (req, res) => {
  try {
    const { action, type_produit, limit = 50 } = req.query;
    const where = {};
    if (action) where.action = action;
    if (type_produit) where.type_produit = type_produit;
    const historique = await Historique.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
      // Ajout du log
    await Historique.create({
      action: 'AJOUT',
      produit_id: produit.id,
      produit_nom: produit.nom,
      type_produit: 'SENSIBLE',
      details: `Produit ajouté : ${produit.nom}`
    });
    res.json(historique);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un produit sensible
app.post('/api/produits-sensibles', async (req, res) => {
  try {
    const { 
      nom, 
      description, 
      prix, 
      categorie, 
      sous_categorie,
      quantite, 
      seuil_alerte, 
      image_url,
      necessite_ordonnance,
      classe_therapeutique,
      nom_fabricant,
      lot,
      niveau_danger,
      restrictions_legales
    } = req.body;
    
    if (!nom || !prix || !categorie || !nom_fabricant) {
      return res.status(400).json({ 
        error: 'Nom, prix, catégorie et nom du fabricant sont obligatoires' 
      });
    }

    const produit = await ProduitSensible.create({
      nom,
      description,
      prix,
      categorie,
      sous_categorie: sous_categorie || null,
      quantite: quantite || 0,
      seuil_alerte: seuil_alerte || 5,
      image_url: image_url || '',
      necessite_ordonnance: necessite_ordonnance !== undefined ? necessite_ordonnance : true,
      classe_therapeutique: classe_therapeutique || null,
      nom_fabricant,
      lot: lot || null,
      niveau_danger: niveau_danger || 'Élevé',
      restrictions_legales: restrictions_legales || 'Produit soumis à prescription médicale obligatoire'
    });

      // Ajout du log
    await Historique.create({
      action: 'AJOUT',
      produit_id: produit.id,
      produit_nom: produit.nom,
      type_produit: 'SENSIBLE',
      details: `Produit ajouté : ${produit.nom}`
    });

    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Modifier un produit sensible
app.put('/api/produits-sensibles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ProduitSensible.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedProduit = await ProduitSensible.findByPk(id);
      // Ajout du log
      await Historique.create({
        action: 'MODIFICATION',
        produit_id: updatedProduit.id,
        produit_nom: updatedProduit.nom,
        type_produit: 'SENSIBLE',
        details: `Produit modifié : ${updatedProduit.nom}`
      });
      res.json(updatedProduit);
    } else {
      res.status(404).json({ error: 'Produit sensible non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un produit sensible
app.delete('/api/produits-sensibles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await ProduitSensible.findByPk(id); // Récupérer le produit avant suppression
    if (!produit) {
      return res.status(404).json({ error: 'Produit sensible non trouvé' });
    }

    const deleted = await ProduitSensible.destroy({
      where: { id }
    });
    if (deleted) {
        // Ajout du log
      await Historique.create({
        action: 'SUPPRESSION',
        produit_id: id,
        produit_nom: produit.nom,
        type_produit: 'SENSIBLE',
        details: `Produit sensible supprimé : ${produit.nom}`
      });
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Produit sensible non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// ROUTES COMMUNES
// =============================================

// GET - Statistiques par catégorie (produits normaux)
app.get('/api/statistiques/categories', async (req, res) => {
  try {
    const stats = await Produit.findAll({
      attributes: [
        'categorie',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('quantite')), 'quantite_totale'],
        [sequelize.fn('AVG', sequelize.col('prix')), 'prix_moyen']
      ],
      group: ['categorie'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Alertes de stock (produits normaux)
app.get('/api/alertes/categories', async (req, res) => {
  try {
    const alertes = await Produit.findAll({
      where: {
        quantite: {
          [sequelize.Op.lte]: sequelize.col('seuil_alerte')
        }
      },
      attributes: ['id', 'nom', 'categorie', 'quantite', 'seuil_alerte'],
      order: [['categorie', 'ASC'], ['quantite', 'ASC']]
    });
    
    res.json(alertes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Liste de toutes les catégories disponibles
app.get('/api/categories', async (req, res) => {
  try {
    const categories = [
      'Médicament Général',
      'Antibiotiques',
      'Analgésiques',
      'Antidépresseurs',
      'Traitement Psychique',
      'Morphiniques',
      'Cardiovasculaire',
      'Digestif',
      'Dermatologique',
      'Protection',
      'Diagnostic',
      'Équipement',
      'Consommable'
    ];
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Liste des classes thérapeutiques (produits normaux)
app.get('/api/classes-therapeutiques', async (req, res) => {
  try {
    const classes = await Produit.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('classe_therapeutique')), 'classe']
      ],
      where: {
        classe_therapeutique: {
          [sequelize.Op.not]: null
        }
      },
      order: [['classe_therapeutique', 'ASC']]
    });
    
    const classesList = classes.map(item => item.get('classe')).filter(Boolean);
    res.json(classesList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de santé
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    // Statistiques générales
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

// Initialisation avec données d'exemple
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à la base de données SQLite');

    // Synchroniser les tables
    await sequelize.sync({ force: false });
    console.log('✅ Tables synchronisées');

    // Vérifier le contenu de la base
    const totalProduits = await Produit.count();
    const totalSensibles = await ProduitSensible.count();
    console.log(`📊 Base de données : ${totalProduits} produits normaux, ${totalSensibles} produits sensibles`);
  
    app.listen(PORT, () => {
      console.log(`🚀 Service Produits Médicaux démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💊 API Produits Normaux: http://localhost:${PORT}/api/produits`);
      console.log(`🔒 API Produits Sensibles: http://localhost:${PORT}/api/produits-sensibles`);
    });

  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
  }
}

startServer();

module.exports = app;