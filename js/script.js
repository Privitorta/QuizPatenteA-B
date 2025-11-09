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

// Funzione per caricare le domande dal file JSON
function loadQuestions() {
        // Mostra messaggio di caricamento
        if (typeof statusMessage !== 'undefined' && statusMessage) {
                statusMessage.textContent = 'Caricamento domande in corso...';
        }

        fetch('domande.json')
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
let searchInput, resultsContainer, statusMessage, sunIcon, moonIcon, htmlEl;
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

// Loading e ricerca delle domande

// Funzione per mostrare i risultati
function renderResults(searchTerm) {
    // Pulisci i risultati precedenti
    resultsContainer.innerHTML = ''; 

    if (searchTerm.length < 2) {
        // Non cercare se il termine è troppo corto
        resultsContainer.appendChild(statusMessage);
        statusMessage.textContent = 'Scrivi almeno 2 caratteri per iniziare la ricerca.';
        return;
    }

    // Filtra le domande
    const filteredQuestions = allQuestions.filter(q => 
        q.domanda.toLowerCase().includes(searchTerm)
    );

    if (filteredQuestions.length === 0) {
        // Nessun risultato
        resultsContainer.innerHTML = `
            <p class="text-center text-gray-500 dark:text-gray-400">
                Nessuna domanda trovata per "${searchTerm}".
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
                    <span class="font-medium text-gray-500 dark:text-gray-400 text-sm">[${q.numero}]</span>
                    ${q.domanda}
                </p>
                <p class="font-bold text-lg ${answerClass}">
                    ${q.risposta}
                </p>
            `;
            resultsContainer.appendChild(card);
        });
    }
}

// Gestore per la ricerca (chiamato da oninput)
function handleSearch(value) {
    const searchTerm = value.trim().toLowerCase();
    renderResults(searchTerm);
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

    // Carica le domande dal file JSON
    loadQuestions();

    // Controlla il tema salvato in localStorage o le preferenze di sistema
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        isDarkMode = true;
    } else if (savedTheme === 'light') {
        isDarkMode = false;
    } else {
        // Se non c'è nulla in localStorage, controlla le preferenze di sistema
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Applica il tema al caricamento
    updateTheme(isDarkMode);
};
