const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Produit = require('../models/Produit');

// GET - Liste de toutes les catégories disponibles
router.get('/categories', async (req, res) => {
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
router.get('/classes-therapeutiques', async (req, res) => {
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

module.exports = router;