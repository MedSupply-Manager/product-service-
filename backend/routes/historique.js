const express = require('express');
const router = express.Router();
const Historique = require('../models/Historique');

// GET - Récupérer l'historique (avec filtres optionnels)
router.get('/historique', async (req, res) => {
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

module.exports = router;