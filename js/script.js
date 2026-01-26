tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
        },
    },
}

// Funzione per pulire la ricerca
function clearSearch() {
    searchInput.value = '';
    clearButton.style.display = 'none';
    handleSearch('');
    searchInput.focus();
}

// Funzione per caricare le domande dal file JSON
function loadQuestions() {
    // Mostra messaggio di caricamento
    if (typeof statusMessage !== 'undefined' && statusMessage) {
            statusMessage.textContent = 'Caricamento domande in corso...';
    }

    return fetch('domande.json')
        .then(response => {
                if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
                return response.json();
        })
        .then(data => {
                allQuestions = data;
                if (typeof statusMessage !== 'undefined' && statusMessage) {
                        statusMessage.textContent = 'Ci sono ' + allQuestions.length + ' quiz disponibili. Scrivi almeno 2 caratteri per iniziare la ricerca.';
                }
        })
        .catch(err => {
                console.error('Errore caricamento domande:', err);
                if (typeof statusMessage !== 'undefined' && statusMessage) {
                        statusMessage.textContent = 'Errore caricamento domande. Dettagli: ' + err.message;
                }
        });
}
// Variabili globali per gli elementi e lo stato
let searchInput, resultsContainer, statusMessage, sunIcon, moonIcon, htmlEl, clearButton;
let allQuestions = [];
let isDarkMode = false;

// Dark/Light

// Update del tema
function updateTheme(isDark) {
    if (isDark) {
        htmlEl.classList.add('dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        htmlEl.classList.remove('dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// Theme toggle
function toggleTheme() {
    isDarkMode = !isDarkMode; // Inverti lo stato
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Salva la preferenza
    updateTheme(isDarkMode);
}

// Sanitizzazione

function sanitizeSearchInput(value) {
    if (value == null) return '';
    return String(value).trim().toLowerCase().replace(/[\u0000-\u001F\u007F<>]/g, '');
}

// Normalizza il testo per la ricerca (rimuove spazi multipli, punteggiatura, simboli, articoli)
function normalizeForSearch(text) {
    if (text == null) return '';
    return String(text)
        .toLowerCase() // Case-insensitive
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
        .replace(/[''’`´]/g, '') // Rimuove apostrofi e apici vari
        .replace(/["«»“”""]/g, '') // Rimuove virgolette varie
        .replace(/[.,;:!?¿¡]/g, '') // Rimuove punteggiatura
        .replace(/\s*([()])\s*/g, '$1') // Rimuove spazi intorno alle parentesi
        .replace(/\s+/g, ' ') // Sostituisce spazi multipli con uno singolo
        .trim()
        .split(' ')
        .filter(word => {
            const articoli = ['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'l', "della", "delle", "del,", "dei", "degli", "dell'", "d'", "al", "allo", "alla", "ai", "agli", "alle", "dal", "dallo", "dalla", "dai", "dagli", "dalle"];
            return !articoli.includes(word);
        })
        .join(' ');
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Loading e ricerca delle domande

// Funzione per mostrare i risultati
function renderResults(searchTerm) {
    // Pulisci i risultati precedenti
    resultsContainer.innerHTML = '';

    // Assicura che il termine sia sanitizzato
    searchTerm = sanitizeSearchInput(searchTerm);

    if (searchTerm.length < 2) {
        // Non cercare se il termine è troppo corto
        resultsContainer.appendChild(statusMessage);
        statusMessage.textContent = 'Scrivi almeno 2 caratteri per iniziare la ricerca.';
        return;
    }

    // Normalizza il termine di ricerca
    const normalizedSearchTerm = normalizeForSearch(searchTerm);

    // Filtra le domande usando la versione normalizzata
    let filteredQuestions = allQuestions.filter(q => {
        const normalizedQuestion = normalizeForSearch(q.domanda || '');
        return normalizedQuestion.includes(normalizedSearchTerm);
    });

    // Ordina i risultati per `numero` (preferibilmente numerico, altrimenti lessicografico)
    filteredQuestions.sort((a, b) => {
        const na = parseInt(a && a.numero, 10);
        const nb = parseInt(b && b.numero, 10);
        const aNum = Number.isFinite(na) ? na : null;
        const bNum = Number.isFinite(nb) ? nb : null;
        if (aNum != null && bNum != null) return aNum - bNum;
        if (aNum != null) return -1; // numerico prima di non-numerico
        if (bNum != null) return 1;
        // fallback lessicografico (locale-aware, numeric option for mixed strings)
        return (a && a.numero || '').localeCompare((b && b.numero) || '', undefined, {numeric: true});
    });

    if (filteredQuestions.length === 0) {
            resultsContainer.innerHTML = `
                <p class="text-center text-gray-500 dark:text-gray-400">
                    Nessuna domanda trovata per "${escapeHtml(searchTerm)}".
                </p>
            `;
    } else {
        // Mostra i risultati
        filteredQuestions.forEach(q => {
            // Determina il colore della risposta
            const answerClass = q.risposta === 'VERO' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400';

            // Crea l'HTML per la card della domanda
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700';
            card.innerHTML = `
                <p class="mb-3 text-gray-800 dark:text-gray-200">
                    <span class="font-medium text-gray-500 dark:text-gray-400 text-sm">[${escapeHtml(q.numero)}]</span>
                    ${escapeHtml(q.domanda)}
                </p>
                <p class="font-bold text-lg ${answerClass}">
                    ${escapeHtml(q.risposta)}
                </p>
            `;
            resultsContainer.appendChild(card);
        });
    }
}

// Gestore per la ricerca
function handleSearch(value) {
    const searchTerm = sanitizeSearchInput(value);
    renderResults(searchTerm);
    
    // Mostra o nascondi il pulsante clear
    if (clearButton) {
        clearButton.style.display = searchTerm.length > 0 ? 'block' : 'none';
    }
}

// Inizializzazione

window.onload = function() {
    // Assegna gli elementi alle variabili
    searchInput = document.getElementById('search-input');
    resultsContainer = document.getElementById('results-container');
    statusMessage = document.getElementById('status-message');
    sunIcon = document.getElementById('sun-icon');
    moonIcon = document.getElementById('moon-icon');
    htmlEl = document.documentElement;
    clearButton = document.getElementById('clear-button');

    // Carica le domande dal file JSON
    loadQuestions().then(() => {
        try {
            const initial = searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '';
            if (initial.length >= 2) {
                renderResults(initial);
            }
        } catch (e) {
            console.error('Errore ripristino ricerca:', e);
        }
    }).catch(() => {
        // Il messaggio di errore è già mostrato nello statusMessage ;)
    });

    // Controlla il tema salvato in localStorage o le preferenze di sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
    } else if (savedTheme === 'light') {
        isDarkMode = false;
    } else {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateTheme(isDarkMode);
};
