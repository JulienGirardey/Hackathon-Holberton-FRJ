// Point d'entrée principal pour l'extension Quick Links Dashboard

// Variables globales pour l'extension
let quickLinksManager;
let quickLinksUI;

// Charger les modules dynamiquement
async function loadModules() {
  // Charger QuickLinksManager
  const managerScript = document.createElement('script');
  managerScript.src = './src/core/QuickLinksManager.js';
  document.head.appendChild(managerScript);
  
  // Charger QuickLinksUI  
  const uiScript = document.createElement('script');
  uiScript.src = './src/ui/QuickLinksUI.js';
  document.head.appendChild(uiScript);
  
  // Attendre que les scripts soient chargés
  return new Promise((resolve) => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        resolve();
      }
    };
    
    managerScript.onload = checkLoaded;
    uiScript.onload = checkLoaded;
  });
}

// Initialisation de l'extension
async function initializeExtension() {
  try {
    console.log('🚀 Initialisation Quick Links Dashboard...');
    
    // Charger les modules
    await loadModules();
    
    // Attendre que les classes soient disponibles
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Créer le gestionnaire de liens rapides
    quickLinksManager = new window.QuickLinksManager();
    await quickLinksManager.init();
    
    // Créer l'interface utilisateur
    quickLinksUI = new window.QuickLinksUI(quickLinksManager);
    
    // Exposer globalement pour debugging
    window.quickLinksManager = quickLinksManager;
    window.quickLinksUI = quickLinksUI;
    
    console.log('✅ Extension initialisée avec succès');
    console.log('📊 Liens disponibles:', quickLinksManager.links.length);
    
  } catch (error) {
    console.error('❌ Erreur initialisation extension:', error);
  }
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
  console.error('Erreur extension:', event.error);
});

// Démarrage automatique quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}
