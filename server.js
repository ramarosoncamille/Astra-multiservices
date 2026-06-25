const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '.')));

// Route pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Serveur Astra Multitâche actif' });
});

// Servir l'index.html pour toutes les autres routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur Astra Multitâche démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
});
