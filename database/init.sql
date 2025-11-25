-- Script d'initialisation de notre base de données
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);