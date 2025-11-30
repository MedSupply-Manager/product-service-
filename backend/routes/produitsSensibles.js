const express = require('express');
const router = express.Router();
const ProduitSensible = require('../models/ProduitSensible');
const Historique = require('../models/Historique');

// GET - Tous les produits sensibles
router.get('/produits-sensibles', async (req, res) => {
  try {
    const produits = await ProduitSensible.findAll({
      order: [['nom', 'ASC']]
    });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un produit sensible
router.post('/produits-sensibles', async (req, res) => {
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
router.put('/produits-sensibles/:id', async (req, res) => {
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
router.delete('/produits-sensibles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const produit = await ProduitSensible.findByPk(id);
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

module.exports = router;