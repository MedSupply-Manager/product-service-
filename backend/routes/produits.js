const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const Historique = require('../models/Historique');

// GET - Tous les produits normaux
router.get('/produits', async (req, res) => {
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
router.get('/produits/:id', async (req, res) => {
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

// POST - Créer un produit normal
router.post('/produits', async (req, res) => {
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
      nom_fabricant
    } = req.body;
    
    if (!nom || !prix || !categorie || !nom_fabricant) {
      return res.status(400).json({ 
        error: 'Nom, prix, catégorie et nom du fabricant sont obligatoires' 
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
      classe_therapeutique: classe_therapeutique || null,
      nom_fabricant: nom_fabricant || 'Fabricant Inconnu'
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
router.put('/produits/:id', async (req, res) => {
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
router.delete('/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await Produit.findByPk(id);
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

router.patch('/stock/change', async (req, res) => {
  try {
    const { items, checkoutId } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items payload' });
    }

    const results = [];

    for (const item of items) {
      const { productId, quantityChange } = item;

      const produit = await Produit.findByPk(productId);
      if (!produit) {
        results.push({ productId, error: 'Produit non trouvé' });
        continue;
      }

      const oldQuantity = produit.quantite;
      const quantityToAdd = Math.abs(quantityChange);
      const newQuantity = oldQuantity + quantityToAdd;
      

      /* Optional safety check */
      if (newQuantity < 0) {
        results.push({
          productId,
          error: 'Stock insuffisant',
          oldQuantity
        });
        continue;
      }

      produit.quantite = newQuantity;
      await produit.save();

      const actionType = quantityChange > 0 ? 'STOCK AJOUTÉ' : 'STOCK RETIRÉ';
      const changeType = quantityChange > 0 ? 'ajouté' : 'retiré';
      const absQuantity = Math.abs(quantityChange);

      await Historique.create({
        action: actionType,
        produit_id: produit.id,
        produit_nom: produit.nom,
        type_produit: 'NORMAL',
        details: `${absQuantity} unités ${changeType} pour ${produit.nom}. Stock: ${oldQuantity} → ${produit.quantite}`,
        checkout_id: checkoutId
      });

      results.push({
        productId,
        success: true,
        oldQuantity,
        newQuantity: produit.quantite,
        quantityChange
      });
    }

    res.json({
      message: 'Stock updates processed',
      checkoutId,
      results
    });

  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;