// script.js - Gestion des services Astra Multitâche

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
function genererCV() {
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

    const cvHTML = `
        <div class="cv-preview">
            <h2 style="color: #667eea; text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 15px;">
                ${escapeHtml(nom)}
            </h2>
            
            <div style="text-align: center; margin-bottom: 20px; color: #666;">
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Téléphone:</strong> ${escapeHtml(telephone)}</p>
                <p><strong>Adresse:</strong> ${escapeHtml(adresse)}</p>
            </div>

            <h3>📚 Formation</h3>
            <p>${escapeHtml(education).replace(/\n/g, '<br>')}</p>

            <h3>💼 Expérience Professionnelle</h3>
            <p>${escapeHtml(experience).replace(/\n/g, '<br>')}</p>

            <h3>🎯 Compétences</h3>
            <p>${escapeHtml(competences).replace(/\n/g, '<br>')}</p>
        </div>
    `;

    const preview = document.getElementById('cvPreview');
    preview.innerHTML = cvHTML;
    preview.classList.add('active');
}

// ============ GÉNÉRATEUR LETTRE DE MOTIVATION ============
function genererLM() {
    const nom = document.getElementById('lmNom').value;
    const compagnie = document.getElementById('lmCompagnie').value;
    const poste = document.getElementById('lmPoste').value;
    const experience = document.getElementById('lmExperience').value;
    const motivation = document.getElementById('lmMotivation').value;

    if (!nom || !compagnie || !poste) {
        afficherErreur('lmPreview', 'Veuillez remplir tous les champs obligatoires');
        return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    const lmHTML = `
        <div class="lm-preview">
            <p style="text-align: right; margin-bottom: 30px;">${dateStr}</p>
            
            <p style="margin-bottom: 20px;">
                Madame, Monsieur,<br><br>
                C'est avec enthousiasme que je vous présente ma candidature pour le poste de <strong>${escapeHtml(poste)}</strong> au sein de votre entreprise <strong>${escapeHtml(compagnie)}</strong>.
            </p>

            <p style="margin-bottom: 20px;">
                <strong>Mon expérience :</strong><br>
                ${escapeHtml(experience).replace(/\n/g, '<br>')}
            </p>

            <p style="margin-bottom: 20px;">
                <strong>Ma motivation :</strong><br>
                ${escapeHtml(motivation).replace(/\n/g, '<br>')}
            </p>

            <p style="margin-bottom: 30px;">
                Convaincu que mon profil correspond à vos attentes, je demeure à votre disposition pour discuter de ma candidature.
            </p>

            <p>
                Cordialement,<br><br>
                ${escapeHtml(nom)}
            </p>
        </div>
    `;

    const preview = document.getElementById('lmPreview');
    preview.innerHTML = lmHTML;
    preview.classList.add('active');
}

// ============ CORRECTEUR ORTHOGRAPHE ============
function corrigerTexte() {
    const texte = document.getElementById('textToCorrect').value.trim();

    if (!texte) {
        afficherErreur('correcteurPreview', 'Veuillez entrer un texte à corriger');
        return;
    }

    // Vérifications basiques
    const erreurs = [];
    const warnings = [];

    // Vérifier les espaces doubles
    if (/  +/.test(texte)) {
        erreurs.push('❌ Espaces doubles détectés');
    }

    // Vérifier les tirets d'union mal placés
    if (/ -|- /.test(texte)) {
        warnings.push('⚠️ Vérifiez les tirets d\'union');
    }

    // Vérifier les majuscules après points
    const phrases = texte.split(/[.!?]+/);
    let hasLowerAfterPoint = false;
    for (let i = 1; i < phrases.length; i++) {
        if (phrases[i].trim() && phrases[i].trim()[0] !== phrases[i].trim()[0].toUpperCase()) {
            hasLowerAfterPoint = true;
        }
    }
    if (hasLowerAfterPoint) {
        warnings.push('⚠️ Certaines phrases ne commencent pas par une majuscule');
    }

    // Vérifier la ponctuation
    if (!/[.!?]$/.test(texte.trim())) {
        warnings.push('⚠️ Le texte ne se termine pas par un point');
    }

    // Analyser la longueur
    const mots = texte.split(/\s+/).length;
    const caracteres = texte.length;

    let correcteurHTML = `
        <div class="correcteur-result">
            <h3>📊 Analyse du texte</h3>
            <p><strong>Nombre de mots:</strong> ${mots}</p>
            <p><strong>Nombre de caractères:</strong> ${caracteres}</p>
    `;

    if (erreurs.length > 0) {
        correcteurHTML += '<div class="error"><strong>Erreurs détectées:</strong><br>' + erreurs.join('<br>') + '</div>';
    }

    if (warnings.length > 0) {
        correcteurHTML += '<div style="color: #f39c12; background: #fdebd0; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #f39c12;"><strong>Avertissements:</strong><br>' + warnings.join('<br>') + '</div>';
    }

    if (erreurs.length === 0 && warnings.length === 0) {
        correcteurHTML += '<div class="success">✅ Aucune erreur détectée!</div>';
    }

    correcteurHTML += '<h4 style="margin-top: 20px;">Texte corrigé:</h4><p style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap;">' + escapeHtml(texte) + '</p></div>';

    const preview = document.getElementById('correcteurPreview');
    preview.innerHTML = correcteurHTML;
    preview.classList.add('active');
}

// ============ TRADUCTEUR (simulation) ============
function traireTexte() {
    const texte = document.getElementById('textToTranslate').value.trim();
    const langueSource = document.getElementById('langueSource').value;
    const langueCible = document.getElementById('langueCible').value;

    if (!texte) {
        afficherErreur('traductionPreview', 'Veuillez entrer un texte à traduire');
        return;
    }

    if (langueSource === langueCible) {
        afficherErreur('traductionPreview', 'La langue source et cible doivent être différentes');
        return;
    }

    // Dictionnaire simple pour simulation
    const dictionnaire = {
        'bonjour': { en: 'hello', es: 'hola', de: 'hallo', it: 'ciao' },
        'au revoir': { en: 'goodbye', es: 'adiós', de: 'auf wiedersehen', it: 'arrivederci' },
        'merci': { en: 'thank you', es: 'gracias', de: 'danke', it: 'grazie' },
        'oui': { en: 'yes', es: 'sí', de: 'ja', it: 'sì' },
        'non': { en: 'no', es: 'no', de: 'nein', it: 'no' },
        'comment allez vous': { en: 'how are you', es: 'cómo estás', de: 'wie geht es dir', it: 'come stai' }
    };

    let traduction = texte;

    // Tentative de traduction basique
    Object.keys(dictionnaire).forEach(motFr => {
        const regex = new RegExp('\\b' + motFr + '\\b', 'gi');
        if (langueSource === 'fr' && dictionnaire[motFr][langueCible]) {
            traduction = traduction.replace(regex, dictionnaire[motFr][langueCible]);
        }
    });

    const languesNoms = {
        'fr': 'Français',
        'en': 'Anglais',
        'es': 'Espagnol',
        'de': 'Allemand',
        'it': 'Italien'
    };

    const traductionHTML = `
        <div class="traduction-result">
            <h3>🌐 Résultat de la traduction</h3>
            <p><strong>Langue source:</strong> ${languesNoms[langueSource]}</p>
            <p><strong>Langue cible:</strong> ${languesNoms[langueCible]}</p>
            
            <h4 style="margin-top: 20px; color: #667eea;">Texte original:</h4>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap; border-left: 4px solid #667eea;">
                ${escapeHtml(texte)}
            </p>

            <h4 style="margin-top: 20px; color: #667eea;">Texte traduit:</h4>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap; border-left: 4px solid #27ae60;">
                ${escapeHtml(traduction)}
            </p>

            <div class="warning" style="margin-top: 15px; color: #f39c12; background: #fdebd0; padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
                <strong>⚠️ Note:</strong> Cette traduction utilise une base de données limitée. Pour une traduction précise, utilisez un service de traduction professionnel.
            </div>
        </div>
    `;

    const preview = document.getElementById('traductionPreview');
    preview.innerHTML = traductionHTML;
    preview.classList.add('active');
}

// ============ FONCTIONS UTILITAIRES ============
function afficherErreur(elementId, message) {
    const preview = document.getElementById(elementId);
    preview.innerHTML = `<div class="error">❌ ${message}</div>`;
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
