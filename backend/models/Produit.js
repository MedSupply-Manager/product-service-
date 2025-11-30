const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produit = sequelize.define('Produit', {
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
    type: DataTypes.ENUM(
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
    ),
    allowNull: false,
    defaultValue: 'Médicament Général'
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
    defaultValue: 10
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: ''
  },
  necessite_ordonnance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  classe_therapeutique: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nom_fabricant: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Fabricant Inconnu' 
  }
}, {
  tableName: 'produits',
  timestamps: true,
  indexes: [
    {
      fields: ['categorie']
    },
    {
      fields: ['necessite_ordonnance']
    }
  ]
});

module.exports = Produit;