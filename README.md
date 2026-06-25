# 🌟 Astra Multitâche - Assistant IA Multiservices

Un assistant en ligne puissant avec intégration OpenAI pour générer des CVs, lettres de motivation, corriger des textes et traduire des documents.

## ✨ Fonctionnalités

- 📄 **Générateur de CV** - Crée des CVs professionnels personnalisés
- 💌 **Générateur de Lettre de Motivation** - Rédige des lettres convaincantes
- ✏️ **Correcteur Orthographe & Grammaire** - Analyse et corrige vos textes
- 🌐 **Traducteur** - Traduit entre 5 langues (FR, EN, ES, DE, IT)

## 🚀 Installation

### Prérequis
- Node.js 14+ installé
- Une clé API OpenAI (obtenir sur https://platform.openai.com)

### Étapes

1. **Clonez le dépôt**
```bash
git clone https://github.com/ramarosoncamille/Astra-multiservices.git
cd Astra-multiservices
```

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez les variables d'environnement**
```bash
cp .env.example .env
```
Éditez `.env` et ajoutez votre clé API OpenAI:
```
OPENAI_API_KEY=sk-votre-cle-api-ici
```

4. **Lancez le serveur**
```bash
npm start
```
Le serveur démarre sur `http://localhost:3000`

5. **Ouvrez l'application**
Accédez à `http://localhost:3000` dans votre navigateur

## 🛠️ Mode développement

Pour le développement avec rechargement automatique:
```bash
npm run dev
```

## 📡 API Endpoints

### Générer un CV
```
POST /api/generer-cv
Body: { nom, email, telephone, adresse, experience, education, competences }
Response: { cv: "<HTML content>" }
```

### Générer une Lettre de Motivation
```
POST /api/generer-lm
Body: { nom, compagnie, poste, experience, motivation }
Response: { lm: "<HTML content>" }
```

### Corriger un texte
```
POST /api/corriger-texte
Body: { texte }
Response: { correction: "<HTML content>" }
```

### Traduire un texte
```
POST /api/traduire-texte
Body: { texte, langueSource, langueCible }
Response: { traduction: "<HTML content>" }
```

### Vérifier la santé de l'API
```
GET /api/health
Response: { status: "API Astra Multitâche opérationnelle ✅" }
```

## 🔐 Sécurité

- **Ne mettez jamais votre clé API dans le dépôt**
- Utilisez toujours `.env` pour les secrets
- Limitez l'accès à votre clé API sur le dashboard OpenAI

## 📦 Dépendances principales

- **express** - Framework web
- **openai** - Intégration OpenAI
- **cors** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

## 🚢 Déploiement

### Sur Heroku
```bash
heroku login
heroku create astra-multiservices
heroku config:set OPENAI_API_KEY=sk-votre-cle-api
git push heroku main
```

### Sur Render
1. Poussez votre code sur GitHub
2. Connectez-vous à https://render.com
3. Créez un nouveau "Web Service"
4. Sélectionnez ce dépôt
5. Ajoutez la variable d'environnement `OPENAI_API_KEY`

## 📝 Utilisation

### 1. Générateur de CV
- Remplissez vos informations personnelles
- Décrivez votre expérience et formation
- Cliquez sur "Générer mon CV"
- L'IA crée un CV professionnel formaté

### 2. Lettre de Motivation
- Entrez vos informations et celles de l'entreprise
- Décrivez votre expérience et motivation
- L'IA rédige une lettre personnalisée

### 3. Correcteur
- Collez votre texte
- L'IA détecte et corrige les erreurs
- Reçoit des explications détaillées

### 4. Traducteur
- Choisissez les langues source et cible
- Entrez le texte à traduire
- L'IA fournit une traduction précise

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez:
1. Forker le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pusher vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📧 Contact

Pour toute question, contactez: ramarosoncamille@gmail.com

## 🎯 Roadmap

- [ ] Intégration d'autres modèles IA
- [ ] Support de plus de langues
- [ ] Historique des documents
- [ ] Export PDF automatique
- [ ] Interface mobile responsive améliorée
- [ ] Système d'authentification utilisateur
- [ ] Base de données pour sauvegarder les documents
