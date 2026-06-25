const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ============ GÉNÉRATEUR CV ============
app.post('/api/generer-cv', async (req, res) => {
  const { nom, email, telephone, adresse, experience, education, competences } = req.body;
  
  if (!nom || !email || !telephone) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Tu es un expert en rédaction de CV. Génère un CV professionnel en HTML formaté avec les informations suivantes:
        
Nom complet: ${nom}
Email: ${email}
Téléphone: ${telephone}
Adresse: ${adresse}

Expérience professionnelle:
${experience}

Formation:
${education}

Compétences:
${competences}

Génère le CV en HTML avec un style professionnel, bien structuré avec des sections claires. Utilise des balises HTML5 appropriées. IMPORTANT: Retourne SEULEMENT le code HTML, sans markdown ou autres décorations.`;

    const result = await model.generateContent(prompt);
    const cvContent = result.response.text();
    res.json({ cv: cvContent });
  } catch (error) {
    console.error('Erreur Google Generative AI:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du CV: ' + error.message });
  }
});

// ============ GÉNÉRATEUR LETTRE DE MOTIVATION ============
app.post('/api/generer-lm', async (req, res) => {
  const { nom, compagnie, poste, experience, motivation } = req.body;
  
  if (!nom || !compagnie || !poste) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Tu es un expert en rédaction de lettres de motivation. Rédige une lettre de motivation professionnelle en HTML formaté pour:
        
Candidat: ${nom}
Entreprise: ${compagnie}
Poste visé: ${poste}

Expérience pertinente:
${experience}

Motivation personnelle:
${motivation}

Rédige une lettre de motivation convaincante, professionnelle et personnalisée. Formate en HTML avec un style élégant. IMPORTANT: Retourne SEULEMENT le code HTML, sans markdown ou autres décorations.`;

    const result = await model.generateContent(prompt);
    const lmContent = result.response.text();
    res.json({ lm: lmContent });
  } catch (error) {
    console.error('Erreur Google Generative AI:', error);
    res.status(500).json({ error: 'Erreur lors de la génération de la lettre: ' + error.message });
  }
});

// ============ CORRECTEUR ORTHOGRAPHE ============
app.post('/api/corriger-texte', async (req, res) => {
  const { texte } = req.body;
  
  if (!texte || texte.trim() === '') {
    return res.status(400).json({ error: 'Veuillez entrer un texte à corriger' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Tu es un expert en correction orthographique et grammaticale. Analyse et corrige ce texte:
        
"${texte}"

Fournis en HTML formaté:
1. Le texte corrigé
2. Une liste des erreurs trouvées avec explications
3. Des suggestions d'amélioration

IMPORTANT: Retourne SEULEMENT le code HTML, sans markdown ou autres décorations.`;

    const result = await model.generateContent(prompt);
    const correction = result.response.text();
    res.json({ correction });
  } catch (error) {
    console.error('Erreur Google Generative AI:', error);
    res.status(500).json({ error: 'Erreur lors de la correction: ' + error.message });
  }
});

// ============ TRADUCTEUR ============
app.post('/api/traduire-texte', async (req, res) => {
  const { texte, langueSource, langueCible } = req.body;
  
  if (!texte || texte.trim() === '') {
    return res.status(400).json({ error: 'Veuillez entrer un texte à traduire' });
  }

  if (langueSource === langueCible) {
    return res.status(400).json({ error: 'La langue source et cible doivent être différentes' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Tu es un traducteur professionnel. Traduis ce texte du ${langueSource} vers le ${langueCible}:
        
"${texte}"

Fournis en HTML formaté:
1. La traduction complète et précise
2. Notes sur les nuances de traduction (le cas échéant)
3. Une brève explication si des termes culturels sont impliqués

IMPORTANT: Retourne SEULEMENT le code HTML, sans markdown ou autres décorations.`;

    const result = await model.generateContent(prompt);
    const traduction = result.response.text();
    res.json({ traduction });
  } catch (error) {
    console.error('Erreur Google Generative AI:', error);
    res.status(500).json({ error: 'Erreur lors de la traduction: ' + error.message });
  }
});

// ============ ROUTE SANTÉ ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'API Astra Multitâche avec Google Gemini opérationnelle ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Astra Multitâche lancé sur http://localhost:${PORT}`);
  console.log('🤖 Utilisant: Google Generative AI (Gemini)');
  console.log('📡 Endpoints disponibles:');
  console.log('  POST /api/generer-cv');
  console.log('  POST /api/generer-lm');
  console.log('  POST /api/corriger-texte');
  console.log('  POST /api/traduire-texte');
  console.log('  GET /api/health');
});
