// models/ProduitSensible.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProduitSensible = sequelize.define('ProduitSensible', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  categorie: {
    type: DataTypes.ENUM('Morphiniques', 'Traitement Psychique', 'Antidépresseurs'),
    allowNull: false
  },
  sous_categorie: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantite: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  seuil_alerte: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: ''
  },
  necessite_ordonnance: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  classe_therapeutique: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nom_fabricant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  niveau_danger: {
    type: DataTypes.ENUM('Élevé', 'Moyen', 'Faible'),
    defaultValue: 'Élevé'
  },
  restrictions_legales: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'produits_sensibles',
  timestamps: true
});

module.exports = ProduitSensible;