const request = require('supertest');
const app = require('../backend/app');

describe('PharmaStock API Basic Tests', () => {
  it('GET /api/produits should return a list of products', async () => {
    const res = await request(app).get('/api/produits');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/produits-sensibles should return sensitive products', async () => {
    const res = await request(app).get('/api/produits-sensibles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /health should return service status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toContain('Service Produits Médicaux en marche');
  });

  it('POST /api/produits should create a new product', async () => {
    const newProduct = {
      nom: 'Test Product',
      prix: 10.50,
      categorie: 'Analgésiques',
      quantite: 25,
      seuil_alerte: 5
    };

    const res = await request(app)
      .post('/api/produits')
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe('Test Product');
    expect(res.body.prix).toBe(10.50);
  });

  it('GET /api/categories should return categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('Analgésiques');
    expect(res.body).toContain('Morphiniques');
  });
});
