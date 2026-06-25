// script.js - Gestion des services Astra Multitâche avec IA

// URL de l'API - Détecte automatiquement si localhost ou production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : window.location.origin;

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

    afficherChargement('cvPreview', 'Génération de votre CV en cours...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/generer-cv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, telephone, adresse, experience, education, competences })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la génération');
        }

        const data = await response.json();
        const preview = document.getElementById('cvPreview');
        preview.innerHTML = `<div class="cv-preview">${data.cv}</div>`;
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

    afficherChargement('lmPreview', 'Génération de votre lettre en cours...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/generer-lm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, compagnie, poste, experience, motivation })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la génération');
        }

        const data = await response.json();
        const preview = document.getElementById('lmPreview');
        preview.innerHTML = `<div class="lm-preview">${data.lm}</div>`;
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

    afficherChargement('correcteurPreview', 'Correction en cours...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/corriger-texte`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texte })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la correction');
        }

        const data = await response.json();
        const preview = document.getElementById('correcteurPreview');
        preview.innerHTML = `<div class="correcteur-result">${data.correction}</div>`;
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

    afficherChargement('traductionPreview', 'Traduction en cours...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/traduire-texte`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texte, langueSource, langueCible })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la traduction');
        }

        const data = await response.json();
        const preview = document.getElementById('traductionPreview');
        preview.innerHTML = `<div class="traduction-result">${data.traduction}</div>`;
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
    preview.innerHTML = `<div class="loading" style="background: #e3f2fd; color: #1976d2; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2; display: flex; align-items: center; gap: 10px;"><span style="animation: spin 1s linear infinite; display: inline-block;">⚙️</span> ${message}</div>`;
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
