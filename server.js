const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ============ GÉNÉRATEUR CV ============
app.post('/api/generer-cv', async (req, res) => {
  const { nom, email, telephone, adresse, experience, education, competences } = req.body;
  
  if (!nom || !email || !telephone) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Tu es un expert en rédaction de CV. Génère un CV professionnel en HTML formaté avec les informations suivantes:
        
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

Génère le CV en HTML avec un style professionnel, bien structuré avec des sections claires. Utilise des balises HTML5 appropriées.`
      }],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const cvContent = response.choices[0].message.content;
    res.json({ cv: cvContent });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
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
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Tu es un expert en rédaction de lettres de motivation. Rédige une lettre de motivation professionnelle en HTML formaté pour:
        
Candidat: ${nom}
Entreprise: ${compagnie}
Poste visé: ${poste}

Expérience pertinente:
${experience}

Motivation personnelle:
${motivation}

Rédige une lettre de motivation convaincante, professionnelle et personnalisée. Formate en HTML avec un style élégant.`
      }],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    const lmContent = response.choices[0].message.content;
    res.json({ lm: lmContent });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
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
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Tu es un expert en correction orthographique et grammaticale. Analyse et corrige ce texte:
        
"${texte}"

Fournis:
1. Le texte corrigé
2. Une liste des erreurs trouvées avec explications
3. Des suggestions d'amélioration

Formate ta réponse en HTML clair et bien structuré.`
      }],
      temperature: 0.5,
      max_tokens: 1500
    });
    
    const correction = response.choices[0].message.content;
    res.json({ correction });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
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
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Tu es un traducteur professionnel. Traduis ce texte du ${langueSource} vers le ${langueCible}:
        
"${texte}"

Fournis:
1. La traduction complète et précise
2. Notes sur les nuances de traduction (le cas échéant)
3. Une brève explication si des termes culturels sont impliqués

Formate ta réponse en HTML clair.`
      }],
      temperature: 0.5,
      max_tokens: 1500
    });
    
    const traduction = response.choices[0].message.content;
    res.json({ traduction });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    res.status(500).json({ error: 'Erreur lors de la traduction: ' + error.message });
  }
});

// ============ ROUTE SANTÉ ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'API Astra Multitâche opérationnelle ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Astra Multitâche lancé sur http://localhost:${PORT}`);
  console.log('📡 Endpoints disponibles:');
  console.log('  POST /api/generer-cv');
  console.log('  POST /api/generer-lm');
  console.log('  POST /api/corriger-texte');
  console.log('  POST /api/traduire-texte');
  console.log('  GET /api/health');
});
