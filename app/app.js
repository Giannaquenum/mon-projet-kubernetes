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
      <h1>🎉 GIGI T'AS RÉUSSI 🤏🏽 !</h1>
      <p><strong>Nombre de visites : ${visitCount}</strong> 👀</p>
      <p>Base de données connectée avec succès ! 🐘</p>
      <p>Chaque fois que tu rafraîchis la page, le compteur augmente !</p>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 50px;
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin: 10px 0; }
        strong { font-size: 1.5em; color: #FFD700; }
      </style>
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