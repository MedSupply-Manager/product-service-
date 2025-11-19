// models/Historique.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historique = sequelize.define('Historique', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.ENUM('AJOUT', 'MODIFICATION', 'SUPPRESSION', 'ACTIVATION', 'DESACTIVATION'),
    allowNull: false
  },
  produit_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Pour lier à un produit (null si action générale)
  },
  produit_nom: {
    type: DataTypes.STRING,
    allowNull: true // Nom du produit au moment de l'action
  },
  type_produit: {
    type: DataTypes.ENUM('NORMAL', 'SENSIBLE'),
    allowNull: true
  },
  utilisateur: {
    type: DataTypes.STRING,
    defaultValue: 'Admin' // À remplacer par l'utilisateur authentifié plus tard
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true // Détails supplémentaires (ex. : changements apportés)
  }
}, {
  tableName: 'historiques',
  timestamps: true,
  indexes: [
    { fields: ['action'] },
    { fields: ['produit_id'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Historique;