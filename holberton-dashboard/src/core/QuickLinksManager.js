// Gestionnaire de liens rapides pour l'extension
class QuickLinksManager {
  constructor() {
    this.links = [];
    this.defaultLinks = [
      {
        id: 'intra-holberton',
        name: 'Intra Holberton',
        url: 'https://intranet.hbtn.io',
        icon: '🎓',
        category: 'education',
        isDefault: true
      },
      {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com',
        icon: '🐙',
        category: 'development',
        isDefault: true
      },
      {
        id: 'slack',
        name: 'Slack',
        url: 'https://slack.com',
        icon: '💬',
        category: 'communication',
        isDefault: true
      },
      {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        icon: '📚',
        category: 'development',
        isDefault: true
      },
      {
        id: 'figma',
        name: 'Figma',
        url: 'https://figma.com',
        icon: '🎨',
        category: 'design',
        isDefault: true
      },
      {
        id: 'notion',
        name: 'Notion',
        url: 'https://notion.so',
        icon: '📝',
        category: 'productivity',
        isDefault: true
      },
      {
        id: 'gmail',
        name: 'Gmail',
        url: 'https://gmail.com',
        icon: '📧',
        category: 'communication',
        isDefault: true
      },
      {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://youtube.com',
        icon: '📺',
        category: 'entertainment',
        isDefault: true
      }
    ];
  }

  // Initialisation
  async init() {
    try {
      await this.loadFromStorage();
      if (this.links.length === 0) {
        // Premier lancement - ajouter les liens par défaut
        this.links = [...this.defaultLinks];
        await this.saveToStorage();
      }
      console.log('✅ QuickLinksManager initialisé avec', this.links.length, 'liens');
    } catch (error) {
      console.error('❌ Erreur initialisation QuickLinksManager:', error);
      this.links = [...this.defaultLinks];
    }
  }

  // Sauvegarde dans Chrome Storage
  async saveToStorage() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ quickLinks: this.links });
      } else {
        localStorage.setItem('quickLinks', JSON.stringify(this.links));
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  }

  // Chargement depuis Chrome Storage
  async loadFromStorage() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get(['quickLinks']);
        this.links = result.quickLinks || [];
      } else {
        const saved = localStorage.getItem('quickLinks');
        this.links = saved ? JSON.parse(saved) : [];
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      this.links = [];
    }
  }

  // Ajouter un nouveau lien
  async addLink(linkData) {
    const newLink = {
      id: this.generateId(),
      name: linkData.name,
      url: this.normalizeUrl(linkData.url),
      icon: linkData.icon || '🔗',
      category: linkData.category || 'custom',
      isDefault: false,
      createdAt: new Date().toISOString(),
      clickCount: 0
    };

    this.links.push(newLink);
    await this.saveToStorage();
    return newLink;
  }

  // Supprimer un lien (seulement les liens personnalisés)
  async deleteLink(linkId) {
    const linkIndex = this.links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) return false;

    const link = this.links[linkIndex];
    if (link.isDefault) {
      console.warn('Impossible de supprimer un lien par défaut');
      return false;
    }

    this.links.splice(linkIndex, 1);
    await this.saveToStorage();
    return true;
  }

  // Modifier un lien
  async updateLink(linkId, updates) {
    const link = this.links.find(l => l.id === linkId);
    if (!link) return false;

    // Ne pas permettre de modifier les liens par défaut (sauf le compteur)
    if (link.isDefault && Object.keys(updates).some(key => key !== 'clickCount')) {
      console.warn('Impossible de modifier un lien par défaut');
      return false;
    }

    Object.assign(link, updates);
    await this.saveToStorage();
    return true;
  }

  // Ouvrir un lien et incrémenter le compteur
  async openLink(linkId) {
    const link = this.links.find(l => l.id === linkId);
    if (!link) return false;

    try {
      // Incrémenter le compteur de clics
      await this.updateLink(linkId, { 
        clickCount: (link.clickCount || 0) + 1,
        lastUsed: new Date().toISOString()
      });

      // Ouvrir le lien dans un nouvel onglet
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        await chrome.tabs.create({ url: link.url });
      } else {
        window.open(link.url, '_blank');
      }

      return true;
    } catch (error) {
      console.error('Erreur ouverture lien:', error);
      return false;
    }
  }

  // Rechercher des liens
  searchLinks(query = '', category = 'all') {
    let filtered = this.links;

    // Filtrer par catégorie
    if (category !== 'all') {
      filtered = filtered.filter(link => link.category === category);
    }

    // Filtrer par recherche textuelle
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(link => 
        link.name.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm)
      );
    }

    // Trier par utilisation puis par nom
    return filtered.sort((a, b) => {
      const usageA = a.clickCount || 0;
      const usageB = b.clickCount || 0;
      
      if (usageA !== usageB) {
        return usageB - usageA; // Plus utilisés en premier
      }
      
      return a.name.localeCompare(b.name); // Puis alphabétique
    });
  }

  // Obtenir les catégories disponibles
  getCategories() {
    const categories = [...new Set(this.links.map(link => link.category))];
    return categories.sort();
  }

  // Réinitialiser aux liens par défaut
  async resetToDefaults() {
    this.links = [...this.defaultLinks];
    await this.saveToStorage();
  }

  // Utilitaires privées
  generateId() {
    return 'link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  normalizeUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  // Obtenir les catégories disponibles
  getCategories() {
    const categories = [...new Set(this.links.map(link => link.category))];
    return categories.sort();
  }

  // Générer un ID unique
  generateId() {
    return 'link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Normaliser une URL
  normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }
}

// Exposer globalement
window.QuickLinksManager = QuickLinksManager;
