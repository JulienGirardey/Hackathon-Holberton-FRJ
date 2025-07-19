// Gestionnaire principal en Vanilla JS
class ClipboardManager {
  constructor() {
    this.clips = [];
    this.settings = {
      maxItems: 100,
      autoDeleteAfterDays: 7,
      enableNotifications: true
    };
    this.init();
  }

  async init() {
    await this.loadFromStorage();
    this.setupEventListeners();
    this.cleanOldClips();
  }

  // Chargement depuis Chrome Storage
  async loadFromStorage() {
    try {
      const result = await chrome.storage.local.get(['clips', 'settings']);
      this.clips = result.clips || [];
      this.settings = { ...this.settings, ...result.settings };
    } catch (error) {
      console.error('Erreur chargement storage:', error);
    }
  }

  // Sauvegarde vers Chrome Storage
  async saveToStorage() {
    try {
      await chrome.storage.local.set({
        clips: this.clips,
        settings: this.settings
      });
    } catch (error) {
      console.error('Erreur sauvegarde storage:', error);
    }
  }

  // Ajouter un nouveau clip
  async addClip(content, type = null) {
    if (!content || content.trim() === '') return null;

    const trimmedContent = content.trim();
    
    // Vérifier doublons
    const existingIndex = this.clips.findIndex(clip => clip.content === trimmedContent);
    if (existingIndex !== -1) {
      // Mettre à jour et remonter
      const existingClip = this.clips[existingIndex];
      existingClip.usage_count += 1;
      existingClip.timestamp = Date.now();
      
      this.clips.splice(existingIndex, 1);
      this.clips.unshift(existingClip);
      
      await this.saveToStorage();
      return existingClip;
    }

    // Créer nouveau clip
    const newClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: trimmedContent,
      type: type || this.detectContentType(trimmedContent),
      timestamp: Date.now(),
      usage_count: 0,
      preview: trimmedContent.length > 100 ? trimmedContent.substring(0, 100) + '...' : trimmedContent
    };

    this.clips.unshift(newClip);
    
    // Limiter le nombre d'éléments
    if (this.clips.length > this.settings.maxItems) {
      this.clips.splice(this.settings.maxItems);
    }

    await this.saveToStorage();
    return newClip;
  }

  // Copier vers le presse-papiers
  async copyClip(clipId) {
    const clip = this.clips.find(c => c.id === clipId);
    if (!clip) return false;

    try {
      await navigator.clipboard.writeText(clip.content);
      
      // Incrémenter usage
      clip.usage_count += 1;
      clip.timestamp = Date.now();
      
      await this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Erreur copie:', error);
      return false;
    }
  }

  // Supprimer un clip
  async deleteClip(clipId) {
    this.clips = this.clips.filter(c => c.id !== clipId);
    await this.saveToStorage();
  }

  // Recherche et filtrage
  searchClips(searchTerm, category = 'all') {
    return this.clips.filter(clip => {
      const matchesSearch = searchTerm === '' || 
        clip.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clip.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || clip.type === category;
      
      return matchesSearch && matchesCategory;
    });
  }

  // Détection du type de contenu
  detectContentType(text) {
    // URL
    if (/^https?:\/\/.+/i.test(text)) return 'url';
    
    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'email';
    
    // JSON
    try {
      JSON.parse(text);
      return 'json';
    } catch {}
    
    // HTML
    if (/<[^>]+>/.test(text)) return 'html';
    
    // Code
    const codePatterns = [
      /function\s+\w+\s*\(/,
      /class\s+\w+/,
      /import\s+.+from/,
      /const\s+\w+\s*=/,
      /if\s*\(.+\)\s*{/
    ];
    if (codePatterns.some(pattern => pattern.test(text))) return 'code';
    
    return 'text';
  }

  // Nettoyage des anciens clips
  cleanOldClips() {
    if (this.settings.autoDeleteAfterDays <= 0) return;
    
    const cutoffDate = Date.now() - (this.settings.autoDeleteAfterDays * 24 * 60 * 60 * 1000);
    const initialLength = this.clips.length;
    
    this.clips = this.clips.filter(clip => clip.timestamp > cutoffDate);
    
    if (this.clips.length !== initialLength) {
      this.saveToStorage();
    }
  }

  // Lire le presse-papiers
  async readClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim() !== '') {
        return await this.addClip(text);
      }
    } catch (error) {
      console.error('Erreur lecture presse-papiers:', error);
    }
    return null;
  }

  // Export des données
  exportData() {
    return JSON.stringify({
      clips: this.clips,
      settings: this.settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  // Import des données
  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.clips && Array.isArray(data.clips)) {
        this.clips = [...data.clips, ...this.clips];
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }
        await this.saveToStorage();
        return true;
      }
    } catch (error) {
      console.error('Erreur import:', error);
    }
    return false;
  }

  // Configuration des event listeners
  setupEventListeners() {
    // Écouter les messages du background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'newClip') {
          this.addClip(request.content).then(clip => {
            sendResponse({ success: true, clip });
          });
          return true;
        }
      });
    }
  }
}

// Exposer globalement pour utilisation dans le HTML
window.ClipboardManager = ClipboardManager;
