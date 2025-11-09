# Quiz Patente A/B

Progetto semplice per cercare domande di quiz patente (A/B) lato client, le domande sono aggiornate a quelle del 2025 e sono 7106 quiz V/F totali.

- Carica l'elenco delle domande da `domande.json` tramite `fetch`
- Ricerca testuale (minimo 2 caratteri) su tutte le domande presenti nel file
- Toggle light/dark mode con toggle che si autosalva in `localStorage`

## Struttura

- `index.html` — interfaccia utente principale e markup
- `script.js` — logica JavaScript: caricamento domande, ricerca e gestione tema
- `style.css` — poche regole CSS (font ecc.)
- `domande.json` — file JSON con le domande

## File `domande.json`

Il file è un array di domande di questo tipo:

```json
[
	{
		"numero": "21812",
		"domanda": "Testo della domanda...",
		"risposta": "VERO"
	}
]
```

Così com'è, il progetto assume che `domande.json` risieda nella stessa cartella di `index.html`.

## Accedere alla WebApp
Si può facilmente accedere alla webapp tramite il sito GitHub pages che trovi sulla pagina della repo oppure qui: [https://privitorta.github.io/QuizPatenteA-B/](https://privitorta.github.io/QuizPatenteA-B)/.

### Sviluppo locale

Il `fetch` non funziona aprendo direttamente `index.html` con il protocollo `file://` in molti browser. Si può avviare un server HTTP semplice e aprire la pagina tramite `http://`.

Esempio con Windows, da shell (`cmd.exe`) se hai Python:

```cmd
cd C:\Users\Emma\Documents\Cosucce\projects\QuizPatenteA-B
python -m http.server 8000

:: poi apri nel browser:
http://localhost:8000/
```

O se preferisci Node:

```cmd
npx http-server -p 8000
```

## Risoluzione problemi

- Se vedi il messaggio di errore relativo al caricamento delle domande: probabilmente stai aprendo il file con `file://`. Avvia un server HTTP come mostrato sopra
- Se le icone del tema non appaiono o sono sfasate: assicurati di avere `script.js` caricato (vedi console del browser per errori). Ho incluso un fix inline per la visibilità iniziale delle icone
- Se il layout sembra rotto: assicurati che Tailwind sia caricato (pagina richiede connessione a Internet per la CDN di Tailwind nella versione corrente)

## Contatti
Se vuoi connetterti con me, puoi utilizzare uno tra i seguenti:
- [LinkedIn](https://www.linkedin.com/in/emmaprivitera/)
- [E-mail](mailto:emma.privitera.505@gmail.com)