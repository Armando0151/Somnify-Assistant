// Sélection des éléments du DOM
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
                  1. Fournis toujours des conseils clairs et utiles en premier. Ne pose des questions que si tu as besoin de clarifier la situation de l'utilisateur.
                  2. Si l'utilisateur te pose une question hors sujet, explique-lui gentiment que tu es spécialisé dans le sommeil
                    et propose-lui de recentrer la conversation sur ce sujet.
                  3. Si l'utilisateur te remercie ou dit 'à bientôt', conclus avec une phrase bienveillante adaptée à l'heure actuelle (${currentHour}h) :
                    - Matin (5h-11h) : "Bonjour ! À bientôt"
                    - Après-midi (12h-17h) : "Bonne journée"
                    - Soir (18h-21h) : "Bonsoir"
                    - Nuit (22h-4h) : "Bonne nuit"
                  4. Utilise un ton naturel et conversationnel, comme si tu parlais à un ami, tout en restant informatif et bienveillant.
                  5. Garde en mémoire le contexte de la conversation pour fournir des réponses cohérentes et pertinentes.`
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

    // Nettoyage du texte reçu de l'API
    const rawText = data.candidates[0].content.parts[0].text;

    // Étape 1 : Gérer les mots en gras (**gras**) et en italique (*italique*)
    const formattedText = rawText
      .replace(/\*\*(.*?)\*\*/g, '𝐁𝐎𝐋𝐃:$1:𝐁𝐎𝐋𝐃') // Marque les mots en gras
      .replace(/\*(.*?)\*/g, '𝐼𝑇𝐴𝐿𝐼𝐶:$1:𝐼𝑇𝐴𝐿𝐼𝐶'); // Marque les mots en italique

    // Étape 2 : Gérer les listes (à puces ou numérotées)
    let lines = formattedText.split('\n');

    const processedLines = lines.map(line => {
      // Détection séparée des puces et listes numérotées
      const isBulletList = /^(\s*[-*•])\s+/.test(line);
      const isNumberedList = /^(\s*\d+\.)\s+/.test(line);

    if (isBulletList) {
      // Formatage des listes à puces avec indentation
      return '  • ' + line.replace(/^(\s*[-*•])\s+/, '');
    } else if (isNumberedList) {
      // Formatage des listes numérotées avec conservation des nombres
      return '  ' + line.replace(/^(\s*\d+\.)\s+/, '$1 ');
    } else {
      // Lignes normales
      return line;
    }
  });

  // Étape 3 : Nettoyage final
  let cleanText = processedLines.join('\n')
    .replace(/\n{3,}/g, '\n\n')  // Max 2 sauts de ligne consécutifs
    .replace(/ +\n/g, '\n')      // Supprimer espaces avant saut de ligne
    .trim();

  // Étape 4 : Appliquer le gras et l'italique avec Unicode
  cleanText = cleanText
    .replace(/𝐁𝐎𝐋𝐃:(.*?):𝐁𝐎𝐋𝐃/g, (_, text) => toBold(text)) // Appliquer le gras
    .replace(/𝐼𝑇𝐴𝐿𝐼𝐶:(.*?):𝐼𝑇𝐴𝐿𝐼𝐶/g, (_, text) => toItalic(text)); // Appliquer l'italique

  // Fonction pour convertir en gras (Unicode)
  function toBold(text) {
    const boldMap = {
      a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷',
      k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁',
      u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
      A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝',
      K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧',
      U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
      0: '𝟬', 1: '𝟭', 2: '𝟮', 3: '𝟯', 4: '𝟰', 5: '𝟱', 6: '𝟲', 7: '𝟳', 8: '𝟴', 9: '𝟵'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
  }

  // Fonction pour convertir en italique (Unicode)
  function toItalic(text) {
    const italicMap = {
      a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',
      k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵',
      u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
      A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',
      K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',
      U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡'
    };
    return text.split('').map(char => italicMap[char] || char).join('');
  }

  // Affichage dans l'élément
  messageElement.innerText = cleanText;
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

// Nouveau code pour gérer l'ouverture et la fermeture du chatbot
const openChatbotButton = document.querySelector("#open-chatbot"); // Bouton pour ouvrir le chatbot
const closeChatbotButton = document.querySelector("#close-chatbot"); // Bouton pour fermer le chatbot
const chatbotPopup = document.querySelector(".chatbot-popup"); // Conteneur du chatbot

// Fonction pour ouvrir la fenêtre du chatbot
const openChatbot = () => {
  chatbotPopup.classList.remove("hidden"); // Supprime la classe "hidden" pour afficher le chatbot
  openChatbotButton.classList.add("hidden"); // Cache le bouton d'ouverture avec une animation
};

// Fonction pour fermer la fenêtre du chatbot
const closeChatbot = () => {
  chatbotPopup.classList.add("hidden"); // Ajoute la classe "hidden" pour cacher le chatbot avec une animation
  setTimeout(() => {
    openChatbotButton.classList.remove("hidden"); // Affiche le bouton d'ouverture après la fin de l'animation
  }, 300); // Délai correspondant à la durée de l'animation (0.3s)
};

// Gestion des événements de clic
openChatbotButton.addEventListener("click", openChatbot); // Ouvre le chatbot lors du clic
closeChatbotButton.addEventListener("click", closeChatbot); // Ferme le chatbot lors du clic
