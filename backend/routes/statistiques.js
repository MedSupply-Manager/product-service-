const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Produit = require('../models/Produit');

// GET - Statistiques par catégorie (produits normaux)
router.get('/statistiques/categories', async (req, res) => {
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
router.get('/alertes/categories', async (req, res) => {
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

module.exports = router;