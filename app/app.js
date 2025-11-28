const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'postgres-service',  // Nom du service Kubernetes
  port: process.env.DB_PORT || 5432,                // Port PostgreSQL
  database: process.env.DB_NAME || 'mydb',          // Nom de la BDD
  user: process.env.DB_USER || 'myuser',            // Utilisateur
  password: process.env.DB_PASSWORD || 'mypassword' // Mot de passe
};

app.get('/', async (req, res) => {
  try {
    const client = new Client(dbConfig);
    await client.connect();
    
    // Créer la table si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Ajouter une visite
    await client.query('INSERT INTO visits DEFAULT VALUES');
    
    // Compter les visites
    const result = await client.query('SELECT COUNT(*) as count FROM visits');
    const visitCount = result.rows[0].count;
    
    await client.end();
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>K8s Dashboard</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f0f2f5; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
            border-top: 5px solid #007bff;
          }
          h1 { color: #2c3e50; font-size: 24px; margin-bottom: 10px; }
          .status { 
            display: inline-block; 
            padding: 8px 15px; 
            background-color: #d4edda; 
            color: #155724; 
            border-radius: 20px; 
            font-weight: bold; 
            font-size: 14px;
            margin-bottom: 30px;
          }
          .counter-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .counter-value {
            font-size: 48px;
            font-weight: bold;
            color: #007bff;
            display: block;
          }
          .counter-label { color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .footer { margin-top: 20px; font-size: 12px; color: #adb5bd; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Architecture Micro-Services</h1>
          <div class="status">✅ Base de Données Connectée</div>
          
          <div class="counter-box">
            <span class="counter-label">Visites Totales (Persistance PVC)</span>
            <span class="counter-value">${visitCount}</span>
          </div>

          <p style="color: #495057;">L'application Node.js communique avec PostgreSQL via le réseau interne Kubernetes.</p>
          
          <div class="footer">
            Projet Kubernetes • Version 1.0.0 • Pod Actif
          </div>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    res.send(`
      <h1>😢 Oh non ! Erreur de connexion à la base</h1>
      <p>${error.message}</p>
      <p>Vérifie que la base de données est bien démarrée</p>
      <p>Configuration utilisée :</p>
      <pre>${JSON.stringify(dbConfig, null, 2)}</pre>
    `);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
