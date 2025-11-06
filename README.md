# product-service-
microservice app for products management
# 📊 Documentation d'Architecture - Microservice Produit

## 🎯 Vue d'Ensemble

Ce microservice dédié à la gestion des produits pharmaceutiques suit une architecture en couches avec une séparation claire des responsabilités.

## 🏗️ Architecture Générale

### Architecture en Couches
Présentation Layer → Application Layer → Domain Layer → Infrastructure Layer

### Diagramme Client-Serveur
- **Frontend** : React.js avec Tailwind CSS et Lucide Icons
- **Backend** : Node.js/Express avec Sequelize ORM
- **Base de Données** : SQLite avec 3 tables principales

## 📋 Fonctionnalités Principales

### Cas d'Utilisation (Use Case)
- ✅ **Gestion des Produits Normaux** (CRUD complet)
- ✅ **Gestion des Produits Sensibles** (champs supplémentaires)
- ✅ **Recherche et Filtrage** par nom, description, catégorie
- ✅ **Consultation de l'Historique** des actions
- ✅ **Tableau de Bord** avec statistiques et alertes
- ✅ **Mode Sombre** et informations application

## 🔄 Flux des Données

### Ajout et Consultation Produits

sequenceDiagram
    User->>Frontend: Click "View Products"
    Frontend->>Backend: GET /api/products
    Backend->>Database: Query products (findAll)
    Database->>Backend: Return product list
    Backend->>Frontend: Send JSON data
    Frontend->>User: Render product grid
🗃️ Modèles de Données
Produit Normal
Champ	Type	Description
id	Integer	Identifiant unique
nom	String	Nom du produit
description	String	Description détaillée
ptrc	Decimal	Prix unitaire
categories	String	Catégorie du produit
quantile	Integer	Quantité en stock
seuil_alerte	Integer	Seuil d'alerte stock
image_url	String	URL de l'image
Produit Sensible (étend Produit Normal)
Champ Additionnel	Type	Description
nom_fournisseur	String	Nom du fournisseur
niveau_Ganger	String	Niveau de danger
restrictions_legales	String	Restrictions légales
Historique
Champ	Type	Description
id	Integer	Identifiant unique
action	String	Type d'action effectuée
product_nom	String	Nom du produit concerné
type_produit	String	Type (normal/sensible)
details	String	Détails de l'action
createdAt	DateTime	Date/heure de l'action

🎨 Architecture Technique
Frontend (React.js)
ProductForm : Gestion des formulaires d'ajout/modification
ProductCard : Affichage des produits individuels
State Management : Gestion de l'état local
UI Rendering : Rendu des composants React
Backend (Node.js/Express)

ProductController :
getAllProducts(), getProductById(id)
createProduct(data), updateProduct(id, data), deleteProduct(id)

ProductSensibleController :
Opérations spécifiques aux produits sensibles

HistoriqueController :
getHistoriqueCentre(filter), createHistoriqueEntry(data)
Base de Données (SQLite)
Tables : Produits, ProduitsSensibles, Historique
ORM : Sequelize pour les opérations CRUD
Relations : Clés étrangères et associations

🔍 Recherche et Filtrage
Fonctionnalités
Recherche texte par nom/description
Filtrage par catégorie
Requêtes API avec paramètres de query
Filtrage côté base de données avec clauses WHERE

📊 Tableau de Bord
Métriques Surveillées
Nombre total de produits normaux
Nombre total de produits sensibles
Alertes de stock (quantité < seuil_alerte)
Valeur totale du stock

🛡️ Architecture Microservices (Future Évolution)
Vision Cible
text
Clients → API Gateway → Microservice Produit → Base de Données
API Gateway : Express Gateway pour le routage

Isolation : Service dédié aux produits

Évolutivité : Possibilité d'ajouter d'autres microservices

🚀 Technologies Utilisées
Frontend
React.js
Tailwind CSS
Lucide Icons

Backend
Node.js
Express.js
Sequelize ORM
CORS Middleware
Base de Données
SQLite
Migrations Sequelize

📈 Évolutions Futures
Implémentation de l'API Gateway
Séparation base de données par microservice
Ajout de tests automatisés
Monitoring et logging avancé
API GraphQL en alternative REST

