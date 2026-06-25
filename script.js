// script.js - Gestion des services Astra Multitâche avec Google Gemini

// ⚠️ À FAIRE: Remplacer par votre clé API Google Gemini
// Obtenez-la gratuitement sur: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = 'METTEZ_VOTRE_CLE_API_GEMINI_ICI';

// URL de l'API Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.addEventListener('DOMContentLoaded', function() {
    // Navigation entre les services
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            
            // Désactiver tous les services et boutons
            document.querySelectorAll('.service').forEach(service => {
                service.classList.remove('active');
            });
            
            navButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activer le service sélectionné
            document.getElementById(serviceId).classList.add('active');
            this.classList.add('active');
        });
    });

    // Formulaire CV
    document.getElementById('cvForm').addEventListener('submit', function(e) {
        e.preventDefault();
        genererCV();
    });

    // Formulaire Lettre de Motivation
    document.getElementById('lmForm').addEventListener('submit', function(e) {
        e.preventDefault();
        genererLM();
    });
});

// ============ FONCTION PRINCIPALE GEMINI ============
async function appelGemini(prompt) {
    if (GEMINI_API_KEY === 'METTEZ_VOTRE_CLE_API_GEMINI_ICI') {
        throw new Error('❌ Clé API Gemini non configurée. Obtenez-la sur https://aistudio.google.com/app/apikey');
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 429) {
                throw new Error('Quota Gemini dépassé. Attendez un peu avant de réessayer.');
            }
            throw new Error(errorData.error?.message || 'Erreur API Gemini');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Erreur Gemini:', error);
        throw error;
    }
}

// ============ GÉNÉRATEUR CV ============
async function genererCV() {
    const nom = document.getElementById('cvNom').value;
    const email = document.getElementById('cvEmail').value;
    const telephone = document.getElementById('cvTelephone').value;
    const adresse = document.getElementById('cvAdresse').value;
    const experience = document.getElementById('cvExperience').value;
    const education = document.getElementById('cvEducation').value;
    const competences = document.getElementById('cvCompetences').value;

    if (!nom || !email || !telephone) {
        afficherErreur('cvPreview', 'Veuillez remplir tous les champs obligatoires');
        return;
    }

    afficherChargement('cvPreview', 'Génération de votre CV avec Gemini en cours...');

    try {
        const prompt = `Génère un CV professionnel en HTML bien formaté avec les informations suivantes:
        Nom: ${nom}
        Email: ${email}
        Téléphone: ${telephone}
        Adresse: ${adresse}
        Expérience: ${experience}
        Formation: ${education}
        Compétences: ${competences}
        
        Le CV doit être:
        - Professionnel et bien structuré
        - En HTML (sans balise <html> ni <body>, juste le contenu)
        - Avec des styles CSS inline
        - Prêt à être imprimé`;

        const resultat = await appelGemini(prompt);
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `<div class="cv-preview">${resultat}</div>`;
        preview.classList.add('active');
    } catch (error) {
        afficherErreur('cvPreview', 'Erreur: ' + error.message);
    }
}

// ============ GÉNÉRATEUR LETTRE DE MOTIVATION ============
async function genererLM() {
    const nom = document.getElementById('lmNom').value;
    const compagnie = document.getElementById('lmCompagnie').value;
    const poste = document.getElementById('lmPoste').value;
    const experience = document.getElementById('lmExperience').value;
    const motivation = document.getElementById('lmMotivation').value;

    if (!nom || !compagnie || !poste) {
        afficherErreur('lmPreview', 'Veuillez remplir tous les champs obligatoires');
        return;
    }

    afficherChargement('lmPreview', 'Génération de votre lettre avec Gemini en cours...');

    try {
        const prompt = `Génère une lettre de motivation professionnelle et personnalisée avec les informations suivantes:
        Nom du candidat: ${nom}
        Entreprise: ${compagnie}
        Poste visé: ${poste}
        Expérience pertinente: ${experience}
        Motivation: ${motivation}
        
        La lettre doit être:
        - Professionnelle et persuasive
        - En HTML bien formaté (sans balise <html> ni <body>)
        - Avec des styles CSS inline
        - Personnalisée et unique`;

        const resultat = await appelGemini(prompt);
        const preview = document.getElementById('lmPreview');
        preview.innerHTML = `<div class="lm-preview">${resultat}</div>`;
        preview.classList.add('active');
    } catch (error) {
        afficherErreur('lmPreview', 'Erreur: ' + error.message);
    }
}

// ============ CORRECTEUR ORTHOGRAPHE ============
async function corrigerTexte() {
    const texte = document.getElementById('textToCorrect').value.trim();

    if (!texte) {
        afficherErreur('correcteurPreview', 'Veuillez entrer un texte à corriger');
        return;
    }

    afficherChargement('correcteurPreview', 'Correction avec Gemini en cours...');

    try {
        const prompt = `Corrige le texte suivant pour l'orthographe, la grammaire et le style. Fournissez:
        1. Le texte corrigé
        2. Une liste des erreurs trouvées avec explications
        
        Texte à corriger:
        "${texte}"
        
        Réponds en HTML bien formaté (sans balise <html> ni <body>)`;

        const resultat = await appelGemini(prompt);
        const preview = document.getElementById('correcteurPreview');
        preview.innerHTML = `<div class="correcteur-result">${resultat}</div>`;
        preview.classList.add('active');
    } catch (error) {
        afficherErreur('correcteurPreview', 'Erreur: ' + error.message);
    }
}

// ============ TRADUCTEUR ============
async function traireTexte() {
    const texte = document.getElementById('textToTranslate').value.trim();
    const langueSourceSelect = document.getElementById('langueSource');
    const langueCibleSelect = document.getElementById('langueCible');
    
    const langueSource = langueSourceSelect.options[langueSourceSelect.selectedIndex].text;
    const langueCible = langueCibleSelect.options[langueCibleSelect.selectedIndex].text;

    if (!texte) {
        afficherErreur('traductionPreview', 'Veuillez entrer un texte à traduire');
        return;
    }

    if (langueSourceSelect.value === langueCibleSelect.value) {
        afficherErreur('traductionPreview', 'La langue source et cible doivent être différentes');
        return;
    }

    afficherChargement('traductionPreview', 'Traduction avec Gemini en cours...');

    try {
        const prompt = `Traduis le texte suivant du ${langueSource} vers le ${langueCible}.
        
        Texte à traduire:
        "${texte}"
        
        Fournis:
        1. La traduction complète
        2. Une note sur les nuances ou difficultés de traduction si nécessaire
        
        Réponds en HTML bien formaté (sans balise <html> ni <body>)`;

        const resultat = await appelGemini(prompt);
        const preview = document.getElementById('traductionPreview');
        preview.innerHTML = `<div class="traduction-result">${resultat}</div>`;
        preview.classList.add('active');
    } catch (error) {
        afficherErreur('traductionPreview', 'Erreur: ' + error.message);
    }
}

// ============ FONCTIONS UTILITAIRES ============
function afficherErreur(elementId, message) {
    const preview = document.getElementById(elementId);
    preview.innerHTML = `<div class="error" style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; border-left: 4px solid #c62828;">❌ ${message}</div>`;
    preview.classList.add('active');
}

function afficherChargement(elementId, message) {
    const preview = document.getElementById(elementId);
    preview.innerHTML = `<div class="loading" style="background: #e3f2fd; color: #1976d2; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2; display: flex; align-items: center; gap: 10px;">⏳ ${message}</div>`;
    preview.classList.add('active');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Animation de chargement
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
