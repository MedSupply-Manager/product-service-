const request = require('supertest');
const { app, init, sequelize } = require('../backend/app');

let logMock;
let errorMock;

beforeAll(async () => {
  // Neutralise les console.log et console.error pendant les tests pour éviter "Cannot log after tests are done"
  logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
  errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

  // Attend que la DB et les tables soient prêtes
  await init({ log: false });
});

afterAll(async () => {
  // Restaure les mocks et ferme la connexion DB pour que Jest puisse s'arrêter proprement
  logMock.mockRestore();
  errorMock.mockRestore();
  await sequelize.close();
});

describe('PharmaStock API Basic Tests', () => {
  it('GET /api/produits should return a list of products', async () => {
    const res = await request(app).get('/api/produits');
    console.log('GET /api/produits error:', res.body.error);
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
      seuil_alerte: 5,
      nom_fabricant: 'Test Fabricant'
    };
    console.log('Creating product with data:', newProduct);

    const res = await request(app)
      .post('/api/produits')
      .send(newProduct);

    console.log('POST /api/produits error:', res.body.error);
    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe('Test Product');
    expect(res.body.prix).toBe(10.50);
    expect(res.body.nom_fabricant).toBe('Test Fabricant');
  });

  it('GET /api/categories should return categories list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('Analgésiques');
    expect(res.body).toContain('Morphiniques');
  });
});
