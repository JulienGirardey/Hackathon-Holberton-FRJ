// Background script pour l'extension Chrome
console.log('Smart Clipboard Manager - Background script démarré');

// Installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Smart Clipboard Manager installé avec succès');
  
  // Initialiser le stockage si nécessaire
  chrome.storage.local.get(['clips'], (result) => {
    if (!result.clips) {
      chrome.storage.local.set({clips: []});
    }
  });
});

// Gestion des messages des content scripts ou popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message reçu:', request);
  
  if (request.action === 'saveClip') {
    // Sauvegarder un nouveau clip
    chrome.storage.local.get(['clips'], (result) => {
      const clips = result.clips || [];
      clips.unshift(request.clip);
      
      // Limiter à 100 éléments
      if (clips.length > 100) {
        clips.splice(100);
      }
      
      chrome.storage.local.set({clips: clips}, () => {
        sendResponse({success: true, count: clips.length});
      });
    });
    return true; // Pour permettre la réponse asynchrone
  }
  
  if (request.action === 'getClips') {
    // Récupérer tous les clips
    chrome.storage.local.get(['clips'], (result) => {
      sendResponse({clips: result.clips || []});
    });
    return true;
  }
  
  if (request.action === 'clearClips') {
    // Effacer tous les clips
    chrome.storage.local.set({clips: []}, () => {
      sendResponse({success: true});
    });
    return true;
  }
});

// Optionnel: Gérer les raccourcis clavier (à définir dans le manifest si besoin)
if (chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    console.log('Commande reçue:', command);
    
    if (command === 'read-clipboard') {
      // Envoyer un message au content script actif
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'readClipboard'})
            .catch(err => console.log('Erreur envoi message:', err));
        }
      });
    }
  });
}
