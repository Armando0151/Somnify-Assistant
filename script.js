// Sélection des éléments du DOM (Document Object Model)
const chatBody = document.querySelector(".chat-body"); // Conteneur du chat où les messages sont affichés
const messageInput = document.querySelector(".message-input"); // Champ de saisie pour le message de l'utilisateur
const sendMessageButton = document.querySelector("#send-message"); // Bouton pour envoyer le message

// Configuration de l'API pour interagir avec le modèle de langage Gemini
const API_KEY = "AIzaSyDQ_aWkENQRmlBd4Tp3Uy0v3_Qe66Ow4eo"; // Clé API pour accéder au service
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`; // URL de l'API

// Stockage des données utilisateur
const userData = {
  message: null // Stocke le message de l'utilisateur
};

// Fonction pour créer un élément de message avec des classes dynamiques
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div"); // Crée un nouvel élément div
  div.classList.add("message", ...classes); // Ajoute les classes CSS passées en arguments
  div.innerHTML = content; // Définit le contenu HTML de l'élément
  return div; // Retourne l'élément créé
};

// Fonction pour générer la réponse du bot via l'API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text"); // Sélectionne l'élément où la réponse du bot sera affichée
  const currentHour = new Date().getHours(); // Récupère l'heure actuelle

const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{
      parts: [
        { 
          text: `Tu es Somnify, un coach virtuel spécialisé dans l'amélioration de la qualité du sommeil. 
                Ton rôle est d'aider les utilisateurs à trouver des solutions pour mieux dormir et avoir des journées énergiques. 
                Tu dois répondre uniquement aux questions liées au sommeil de manière professionnelle, polie et humaine. 

                Règles de comportement :
                1. Si l'utilisateur te pose une question hors sujet, explique-lui gentiment que tu es spécialisé dans le sommeil
                  et propose-lui de recentrer la conversation sur ce sujet.
                2. Si l'utilisateur te remercie ou dit 'à bientôt', considère que la conversation est terminée et réponds par une phrase
                  de conclusion bienveillante, adaptée à l'heure actuelle (${currentHour}h) :
                  - Matin (5h-11h) : "Bonjour ! À bientôt"
                  - Après-midi (12h-17h) : "Bonne journée"
                  - Soir (18h-21h) : "Bonsoir"
                  - Nuit (22h-4h) : "Bonne nuit"
                3. Si l'utilisateur te pose une question ambiguë ou demande des clarifications, n'hésite pas à lui poser des questions
                  pour mieux comprendre son besoin.
                4. Utilise un ton naturel et conversationnel, comme si tu parlais à un ami, tout en restant informatif et bienveillant.
                5. Garde en mémoire le contexte de la conversation pour fournir des réponses cohérentes et pertinentes.
                6. Ne salue que lors du premier message ou de la conclusion. Garde le ton naturel comme un ami bienveillant,
                  même dans les conversations longues.`
          },
          { 
            text: userData.message
          }
        ]
      }]
    })
  };

  try {
    // Envoi de la requête à l'API
    const response = await fetch(API_URL, requestOptions); // Attend la réponse de l'API
    const data = await response.json(); // Convertit la réponse en JSON

    // Vérifie si la réponse de l'API est valide
    if (!response.ok) throw new Error(data.error.message); // Lance une erreur si la réponse n'est pas OK

    const MAX_LENGTH = 500; // Longueur maximale du texte

  // Récupère le texte brut ou une chaîne vide si absent
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText) {
    console.error('Aucun texte trouvé dans la réponse de l\'API');
    return;
  }

  // Nettoyage du texte
  const cleanText = rawText
    .replace(/<[^>]+>/g, '') // Supprime les balises HTML
    .replace(/\r\n?/g, '\n') // Normalise les sauts de ligne
    .replace(/\*\*|\*|\n+/g, match => match === '\n' ? '\n' : '') // Supprime les astérisques et nettoie les sauts de ligne
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul espace
    .trim(); // Supprime les espaces inutiles au début et à la fin

  // Tronque le texte et ajoute des ellipses si nécessaire
  const truncatedText = cleanText.length > MAX_LENGTH 
    ? cleanText.slice(0, MAX_LENGTH) + '...' 
    : cleanText;

  // Affichage du texte nettoyé dans l'élément de message
  messageElement.textContent = truncatedText;
  } catch (error) {
    // Gestion des erreurs
    console.log(error); // Affiche l'erreur dans la console
    messageElement.innerText = error.message; // Affiche le message d'erreur dans le chat
    messageElement.style.color = "#ff0000"; // Change la couleur du texte en rouge pour indiquer une erreur
  } finally {
    // Réinitialisation et scroll
    incomingMessageDiv.classList.remove("thinking"); // Supprime l'indicateur de "pensée" du bot
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Fait défiler le chat vers le bas
  }
};

// Fonction pour gérer l'envoi des messages utilisateur
const handleOutgoingMessage = (e) => {
  e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
  userData.message = messageInput.value.trim(); // Récupère et nettoie le message de l'utilisateur
  messageInput.value = ""; // Vide le champ de saisie

  // Création du message utilisateur
  const messageContent = `<div class="message-text"></div>`; // Structure HTML du message utilisateur
  const outgoingMessageDiv = createMessageElement(messageContent, "user-message"); // Crée un élément de message utilisateur
  outgoingMessageDiv.querySelector(".message-text").textContent = userData.message; // Ajoute le texte du message
  chatBody.appendChild(outgoingMessageDiv); // Ajoute le message au conteneur du chat
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Fait défiler le chat vers le bas

  // Simulation de la réponse du bot après un délai
  setTimeout(() => {
    // Structure HTML du message du bot avec un indicateur de "pensée"
    const messageContent = `
      <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      </svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;

    // Crée un élément de message pour le bot avec un indicateur de "pensée"
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv); // Ajoute le message du bot au conteneur du chat
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Fait défiler le chat vers le bas
    generateBotResponse(incomingMessageDiv); // Génère la réponse du bot via l'API
  }, 600); // Délai de 600ms avant d'afficher la réponse du bot
};

// Gestion de la touche Entrée pour envoyer un message
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim(); // Récupère et nettoie le message de l'utilisateur
  if (e.key === "Enter" && userMessage) { // Vérifie si la touche Entrée est pressée et si le message n'est pas vide
    handleOutgoingMessage(e); // Appelle la fonction pour gérer l'envoi du message
  }
});

// Gestion du clic sur le bouton d'envoi
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e)); // Appelle la fonction pour gérer l'envoi du message