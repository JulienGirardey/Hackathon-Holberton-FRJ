// Interface utilisateur en Vanilla JS optimisée
class ClipboardUI {
  constructor(clipboardManager) {
    this.manager = clipboardManager;
    this.currentSearch = '';
    this.currentCategory = 'all';
    this.init();
  }

  init() {
    this.createElements();
    this.setupEventListeners();
    this.render();
  }

  createElements() {
    // Supprimer l'état de chargement
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.remove();
    }

    // Charger les styles CSS externes
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './ui-styles.css';
    document.head.appendChild(link);

    // Container principal
    this.container = document.createElement('div');
    this.container.className = 'clipboard-ui';
    this.container.innerHTML = `
      <div class="header">
        <h1>📋 Smart Clipboard</h1>
        <p>Gestionnaire de presse-papiers intelligent</p>
      </div>

      <div class="controls">
        <button id="readBtn" class="btn btn-primary">📋 Lire</button>
        <button id="clearBtn" class="btn btn-secondary">🗑️ Effacer</button>
        <button id="exportBtn" class="btn btn-secondary">💾 Export</button>
      </div>

      <div class="search-section">
        <input type="text" id="searchInput" placeholder="Rechercher..." class="search-input">
        <select id="categoryFilter" class="category-select">
          <option value="all">Tous les types</option>
          <option value="text">📝 Texte</option>
          <option value="url">🔗 URL</option>
          <option value="email">📧 Email</option>
          <option value="code">💻 Code</option>
          <option value="json">🔧 JSON</option>
          <option value="html">🌐 HTML</option>
        </select>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="stat-number" id="totalCount">0</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-number" id="todayCount">0</span>
          <span class="stat-label">Aujourd'hui</span>
        </div>
      </div>

      <div id="clipsList" class="clips-list"></div>
    `;

    document.getElementById('root').appendChild(this.container);
  }

  setupEventListeners() {
    // Boutons principaux
    document.getElementById('readBtn').addEventListener('click', () => this.handleReadClipboard());
    document.getElementById('clearBtn').addEventListener('click', () => this.handleClearAll());
    document.getElementById('exportBtn').addEventListener('click', () => this.handleExport());

    // Recherche en temps réel
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.currentSearch = e.target.value;
      this.render();
    });

    // Filtre par catégorie
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.currentCategory = e.target.value;
      this.render();
    });

    // Écouter les changements du manager
    this.manager.addEventListener?.('change', () => this.render());
  }

  async handleReadClipboard() {
    const btn = document.getElementById('readBtn');
    const originalText = btn.textContent;
    
    try {
      btn.textContent = '📋 Lecture...';
      btn.disabled = true;
      
      const clip = await this.manager.readClipboard();
      
      if (clip) {
        btn.textContent = '✅ Ajouté';
        this.render();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1000);
      } else {
        btn.textContent = '❌ Rien à lire';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lecture:', error);
      btn.textContent = '❌ Erreur';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1000);
    }
  }

  async handleClearAll() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      this.manager.clips = [];
      await this.manager.saveToStorage();
      this.render();
    }
  }

  handleExport() {
    const data = this.manager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async handleCopyClip(clipId) {
    const success = await this.manager.copyClip(clipId);
    if (success) {
      const clipElement = document.querySelector(`[data-clip-id="${clipId}"]`);
      clipElement.classList.add('copied');
      setTimeout(() => {
        clipElement.classList.remove('copied');
      }, 1000);
      this.render(); // Mettre à jour les stats
    }
  }

  // Nouvelle méthode pour gérer les clics selon le type
  async handleClipClick(clipId, type) {
    if (type === 'url') {
      this.handleOpenUrl(clipId);
    } else if (type === 'email') {
      this.handleSendEmail(clipId);
    } else {
      // Pour les autres types, copier par défaut
      this.handleCopyClip(clipId);
    }
  }

  // Ouvrir une URL dans un nouvel onglet
  handleOpenUrl(clipId) {
    const clip = this.manager.clips.find(c => c.id === clipId);
    if (clip) {
      // Incrémenter le compteur d'utilisation
      this.manager.copyClip(clipId);
      
      // Ouvrir l'URL
      window.open(clip.content, '_blank');
      
      // Feedback visuel
      const clipElement = document.querySelector(`[data-clip-id="${clipId}"]`);
      clipElement.classList.add('opened');
      setTimeout(() => {
        clipElement.classList.remove('opened');
      }, 1000);
      
      this.render();
    }
  }

  // Ouvrir un client email
  handleSendEmail(clipId) {
    const clip = this.manager.clips.find(c => c.id === clipId);
    if (clip) {
      // Incrémenter le compteur d'utilisation
      this.manager.copyClip(clipId);
      
      // Ouvrir le client email
      window.open(`mailto:${clip.content}`, '_blank');
      
      // Feedback visuel
      const clipElement = document.querySelector(`[data-clip-id="${clipId}"]`);
      clipElement.classList.add('opened');
      setTimeout(() => {
        clipElement.classList.remove('opened');
      }, 1000);
      
      this.render();
    }
  }

  async handleDeleteClip(clipId) {
    await this.manager.deleteClip(clipId);
    this.render();
  }

  render() {
    this.updateStats();
    this.renderClips();
  }

  updateStats() {
    const totalCount = this.manager.clips.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = this.manager.clips.filter(clip => {
      const clipDate = new Date(clip.timestamp);
      clipDate.setHours(0, 0, 0, 0);
      return clipDate.getTime() === today.getTime();
    }).length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('todayCount').textContent = todayCount;
  }

  renderClips() {
    const clipsList = document.getElementById('clipsList');
    const filteredClips = this.manager.searchClips(this.currentSearch, this.currentCategory);

    if (filteredClips.length === 0) {
      clipsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div>Aucun élément trouvé</div>
          <div style="font-size: 14px; margin-top: 8px;">
            ${this.manager.clips.length === 0 ? 
              'Cliquez sur "📋 Lire" pour capturer le presse-papiers' : 
              'Essayez avec d\'autres mots-clés'
            }
          </div>
        </div>
      `;
      return;
    }

    clipsList.innerHTML = filteredClips.map(clip => `
      <div class="clip-item" data-clip-id="${clip.id}" onclick="clipboardUI.handleClipClick('${clip.id}', '${clip.type}')">
        <div class="clip-actions">
          <button class="action-btn" onclick="event.stopPropagation(); clipboardUI.handleCopyClip('${clip.id}')" title="Copier">
            📋
          </button>
          ${clip.type === 'url' ? `
            <button class="action-btn" onclick="event.stopPropagation(); clipboardUI.handleOpenUrl('${clip.id}')" title="Ouvrir le lien">
              🔗
            </button>
          ` : ''}
          ${clip.type === 'email' ? `
            <button class="action-btn" onclick="event.stopPropagation(); clipboardUI.handleSendEmail('${clip.id}')" title="Envoyer un email">
              📧
            </button>
          ` : ''}
          <button class="action-btn" onclick="event.stopPropagation(); clipboardUI.handleDeleteClip('${clip.id}')" title="Supprimer">
            🗑️
          </button>
        </div>
        
        <div class="clip-header">
          <span class="clip-type">${this.getTypeIcon(clip.type)} ${clip.type.toUpperCase()}</span>
          <span class="clip-meta">
            ${this.formatTimestamp(clip.timestamp)}
            ${clip.usage_count > 0 ? ` • Utilisé ${clip.usage_count}x` : ''}
          </span>
        </div>
        
        <div class="clip-content">${this.escapeHtml(clip.preview || clip.content)}</div>
        
        <div class="clip-hint">
          ${this.getActionHint(clip.type)}
        </div>
      </div>
    `).join('');
  }

  getTypeIcon(type) {
    const icons = {
      text: '📝',
      url: '🔗',
      email: '📧',
      code: '💻',
      json: '🔧',
      html: '🌐'
    };
    return icons[type] || '📝';
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  }

  getActionHint(type) {
    const hints = {
      url: '🔗 Cliquer pour ouvrir le lien',
      email: '📧 Cliquer pour envoyer un email',
      text: '📋 Cliquer pour copier',
      code: '📋 Cliquer pour copier',
      json: '📋 Cliquer pour copier',
      html: '📋 Cliquer pour copier'
    };
    return `<small>${hints[type] || '📋 Cliquer pour copier'}</small>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Exposer globalement pour utilisation dans le HTML
window.ClipboardUI = ClipboardUI;
