// Popup pour Pocket Links
class PopupQuickLinks {
  constructor() {
    this.links = [];
    this.init();
  }

  async init() {
    try {
      await this.loadLinks();
      this.renderLinks();
      this.setupEventListeners();
    } catch (error) {
      console.error('Erreur initialisation popup:', error);
      this.showError();
    }
  }

  async loadLinks() {
    try {
      // Charger depuis Chrome Storage
      if (chrome && chrome.storage) {
        const result = await chrome.storage.local.get(['quickLinks']);
        this.links = result.quickLinks || this.getDefaultLinks();
      } else {
        // Fallback localStorage
        const saved = localStorage.getItem('quickLinks');
        this.links = saved ? JSON.parse(saved) : this.getDefaultLinks();
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      this.links = this.getDefaultLinks();
    }
  }

  getDefaultLinks() {
    return [
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
      }
    ];
  }

  renderLinks() {
    const container = document.getElementById('linksContainer');
    
    if (this.links.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div>🔗</div>
          <div style="margin-top: 8px; font-size: 12px;">Aucun lien</div>
        </div>
      `;
      return;
    }

    // Trier par utilisation puis par nom
    const sortedLinks = this.links
      .sort((a, b) => {
        const usageA = a.clickCount || 0;
        const usageB = b.clickCount || 0;
        if (usageA !== usageB) return usageB - usageA;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Limiter à 10 liens dans le popup

    container.innerHTML = sortedLinks.map(link => `
      <div class="link-item" data-url="${link.url}" data-id="${link.id}">
        <div class="link-icon">${link.icon}</div>
        <div class="link-info">
          <div class="link-name">${this.escapeHtml(link.name)}</div>
          <div class="link-category">${this.getCategoryName(link.category)}</div>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    // Clic sur les liens
    document.addEventListener('click', (e) => {
      const linkItem = e.target.closest('.link-item');
      if (linkItem) {
        const url = linkItem.dataset.url;
        const linkId = linkItem.dataset.id;
        this.openLink(url, linkId);
      }
    });

    // Bouton dashboard
    document.getElementById('openDashboard').addEventListener('click', () => {
      this.openDashboard();
    });
  }

  async openLink(url, linkId) {
    try {
      // Incrémenter le compteur d'utilisation
      if (linkId) {
        await this.incrementUsage(linkId);
      }

      // Ouvrir le lien
      if (chrome && chrome.tabs) {
        await chrome.tabs.create({ url });
      } else {
        window.open(url, '_blank');
      }

      // Fermer le popup
      window.close();
    } catch (error) {
      console.error('Erreur ouverture lien:', error);
    }
  }

  async incrementUsage(linkId) {
    try {
      const link = this.links.find(l => l.id === linkId);
      if (link) {
        link.clickCount = (link.clickCount || 0) + 1;
        link.lastUsed = new Date().toISOString();

        // Sauvegarder
        if (chrome && chrome.storage) {
          await chrome.storage.local.set({ quickLinks: this.links });
        } else {
          localStorage.setItem('quickLinks', JSON.stringify(this.links));
        }
      }
    } catch (error) {
      console.error('Erreur mise à jour usage:', error);
    }
  }

  openDashboard() {
    const dashboardUrl = chrome.runtime.getURL('index.html');
    if (chrome && chrome.tabs) {
      chrome.tabs.create({ url: dashboardUrl });
    } else {
      window.open('index.html', '_blank');
    }
    window.close();
  }

  getCategoryName(category) {
    const names = {
      education: '🎓 Éducation',
      development: '💻 Développement', 
      communication: '💬 Communication',
      design: '🎨 Design',
      productivity: '📝 Productivité',
      entertainment: '📺 Divertissement',
      custom: '🔗 Personnalisé'
    };
    return names[category] || '��️ ' + category;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError() {
    const container = document.getElementById('linksContainer');
    container.innerHTML = `
      <div class="empty-state">
        <div>❌</div>
        <div style="margin-top: 8px; font-size: 12px;">Erreur de chargement</div>
      </div>
    `;
  }
}

// Initialisation au chargement du popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupQuickLinks();
});
