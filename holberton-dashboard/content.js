// Content script pour interagir avec les pages web
console.log('Smart Clipboard Manager - Content script chargé sur:', window.location.href);

// Écouter les messages du background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'readClipboard') {
    readClipboardContent();
    sendResponse({success: true});
  }
});

// Fonction pour lire le presse-papiers
async function readClipboardContent() {
  try {
    const text = await navigator.clipboard.readText();
    if (text && text.trim() !== '') {
      const clip = createClipboardItem(text.trim());
      
      // Envoyer au background script pour sauvegarde
      chrome.runtime.sendMessage({
        action: 'saveClip',
        clip: clip
      }, (response) => {
        if (response && response.success) {
          console.log('Clip sauvegardé:', clip.content.substring(0, 50) + '...');
          showNotification('📋 Clip ajouté à l\'historique');
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du presse-papiers:', error);
    showNotification('❌ Impossible de lire le presse-papiers');
  }
}

// Fonction pour créer un élément clipboard
function createClipboardItem(content) {
  return {
    id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: content.trim(),
    type: detectContentType(content),
    timestamp: Date.now(),
    usage_count: 0,
    source_url: window.location.href,
    preview: content.length > 100 ? content.substring(0, 100) + '...' : content
  };
}

// Fonction pour détecter le type de contenu
function detectContentType(text) {
  const urlRegex = /^https?:\/\/.+/i;
  if (urlRegex.test(text)) return 'url';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(text)) return 'email';
  
  try {
    JSON.parse(text);
    return 'json';
  } catch {}
  
  const htmlRegex = /<[^>]+>/;
  if (htmlRegex.test(text)) return 'html';
  
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /class\s+\w+/,
    /import\s+.+from/,
    /const\s+\w+\s*=/,
    /if\s*\(.+\)\s*{/
  ];
  if (codePatterns.some(pattern => pattern.test(text))) {
    return 'code';
  }
  
  return 'text';
}

// Fonction pour afficher une notification discrète
function showNotification(message) {
  // Créer une notification temporaire
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Suppression après 3 secondes
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Optionnel: Écouter les événements de copie sur la page
document.addEventListener('copy', () => {
  // Attendre un peu que le contenu soit dans le presse-papiers
  setTimeout(() => {
    readClipboardContent();
  }, 100);
});

// Optionnel: Écouter les raccourcis clavier personnalisés
document.addEventListener('keydown', (event) => {
  // Ctrl+Shift+V pour lire le presse-papiers
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault();
    readClipboardContent();
  }
});
