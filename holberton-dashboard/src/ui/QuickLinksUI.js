// Interface utilisateur pour le gestionnaire de liens rapides
class QuickLinksUI {
  constructor(linksManager) {
    this.manager = linksManager;
    this.currentSearch = '';
    this.currentCategory = 'all';
    this.showAddForm = false;
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
    link.href = './quick-links-styles.css';
    document.head.appendChild(link);

    // Container principal
    this.container = document.createElement('div');
    this.container.className = 'quick-links-ui';
    this.container.innerHTML = `
      <div class="header">
        <h1><img src="src/logo pocket link.png" alt="Logo" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;">Pocket Links</h1>
        <p>Accès rapide à vos applications favorites</p>
      </div>

      <div class="controls">
        <button id="addLinkBtn" class="btn btn-primary">➕ Ajouter un lien</button>
      </div>

      <div class="search-section">
        <input type="text" id="searchInput" placeholder="Rechercher un raccourcie..." class="search-input">
        <select id="categoryFilter" class="category-select">
          <option value="all">Toutes les catégories</option>
          <option value="education">🎓 Éducation</option>
          <option value="development">💻 Développement</option>
          <option value="communication">💬 Communication</option>
          <option value="design">🎨 Design</option>
          <option value="productivity">📝 Productivité</option>
          <option value="entertainment">📺 Divertissement</option>
          <option value="custom">🔗 Personnalisés</option>
        </select>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="stat-number" id="totalCount">0</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-number" id="customCount">0</span>
          <span class="stat-label">Personnalisés</span>
        </div>
      </div>

      <!-- Formulaire d'ajout de lien -->
      <div id="addLinkForm" class="add-form" style="display: none;">
        <div class="form-container">
          <h3>➕ Ajouter un nouveau lien</h3>
          <form id="linkForm">
            <div class="form-group">
              <label for="linkName">Nom :</label>
              <input type="text" id="linkName" required placeholder="Ex: Mon site préféré">
            </div>
            <div class="form-group">
              <label for="linkUrl">URL :</label>
              <input type="url" id="linkUrl" required placeholder="Ex: https://example.com">
            </div>
            <div class="form-group">
              <label for="linkIcon">Icône (emoji) :</label>
              <input type="text" id="linkIcon" placeholder="🔗" maxlength="2">
            </div>
            <div class="form-group">
              <label for="linkCategory">Catégorie :</label>
              <select id="linkCategory">
                <option value="custom">🔗 Personnalisé</option>
                <option value="education">🎓 Éducation</option>
                <option value="development">💻 Développement</option>
                <option value="communication">💬 Communication</option>
                <option value="design">🎨 Design</option>
                <option value="productivity">📝 Productivité</option>
                <option value="entertainment">📺 Divertissement</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">✅ Ajouter</button>
              <button type="button" id="cancelAdd" class="btn btn-secondary">❌ Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <div id="linksList" class="links-grid"></div>
    `;

    document.getElementById('root').appendChild(this.container);
  }

  setupEventListeners() {
    // Écouteur pour ajouter un lien
    document.getElementById('addLinkBtn').addEventListener('click', () => {
      this.showAddLinkModal();
    });

    // Écouteur pour le formulaire d'ajout
    document.getElementById('linkForm').addEventListener('submit', (e) => {
      this.handleAddLink(e);
    });

    // Écouteur pour annuler l'ajout
    document.getElementById('cancelAdd').addEventListener('click', () => {
      this.toggleAddForm(false);
    });

    // Écouteur pour la recherche
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.currentSearch = e.target.value;
      this.render();
    });

    // Écouteur pour le filtre de catégorie
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.currentCategory = e.target.value;
      this.render();
    });

    // Écouteurs pour les liens (delegation)
    document.getElementById('linksList').addEventListener('click', (e) => {
      const linkCard = e.target.closest('.link-card');
      if (!linkCard) return;

      const linkId = linkCard.dataset.linkId;
      
      if (e.target.closest('.delete-btn')) {
        this.handleDeleteLink(linkId);
      } else if (!e.target.closest('.link-actions')) {
        this.handleOpenLink(linkId);
      }
    });
  }

  showAddLinkModal() {
    this.toggleAddForm(true);
  }

  toggleAddForm(show = null) {
    this.showAddForm = show !== null ? show : !this.showAddForm;
    const form = document.getElementById('addLinkForm');
    form.style.display = this.showAddForm ? 'block' : 'none';
    
    if (this.showAddForm) {
      document.getElementById('linkName').focus();
    } else {
      // Réinitialiser le formulaire
      document.getElementById('linkForm').reset();
    }
  }

  async handleAddLink(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const linkData = {
      name: formData.get('linkName') || document.getElementById('linkName').value,
      url: formData.get('linkUrl') || document.getElementById('linkUrl').value,
      icon: formData.get('linkIcon') || document.getElementById('linkIcon').value || '🔗',
      category: formData.get('linkCategory') || document.getElementById('linkCategory').value
    };

    try {
      await this.manager.addLink(linkData);
      this.toggleAddForm(false);
      this.render();
      
      // Feedback visuel
      const btn = document.getElementById('addLinkBtn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Ajouté !';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
      
    } catch (error) {
      console.error('Erreur ajout lien:', error);
      alert('Erreur lors de l\'ajout du lien');
    }
  }

  async handleOpenLink(linkId) {
    if (!this.manager) {
      console.error('Manager non initialisé');
      return;
    }
    await this.manager.openLink(linkId);
    this.render(); // Mettre à jour les stats
  }

  async handleDeleteLink(linkId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
      await this.manager.deleteLink(linkId);
      this.render();
    }
  }

  render() {
    this.updateStats();
    this.renderLinks();
    this.updateCategoryFilter();
  }

  updateStats() {
    if (!this.manager || !this.manager.links) {
      document.getElementById('totalCount').textContent = '0';
      document.getElementById('customCount').textContent = '0';
      return;
    }
    
    const totalCount = this.manager.links.length;
    const customCount = this.manager.links.filter(link => !link.isDefault).length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('customCount').textContent = customCount;
  }

  updateCategoryFilter() {
    if (!this.manager || !this.manager.getCategories) {
      return;
    }
    
    const categories = this.manager.getCategories();
    const select = document.getElementById('categoryFilter');
    
    // Garder les options par défaut et ajouter les catégories dynamiques
    const defaultOptions = select.innerHTML;
    const customCategories = categories
      .filter(cat => !['education', 'development', 'communication', 'design', 'productivity', 'entertainment', 'custom'].includes(cat))
      .map(cat => `<option value="${cat}">🏷️ ${cat}</option>`)
      .join('');
    
    if (customCategories) {
      select.innerHTML = defaultOptions + customCategories;
    }
  }

  renderLinks() {
    const linksList = document.getElementById('linksList');
    const filteredLinks = this.manager.searchLinks(this.currentSearch, this.currentCategory);

    if (filteredLinks.length === 0) {
      linksList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔗</div>
          <div>Aucun lien trouvé</div>
          <div style="font-size: 14px; margin-top: 8px;">
            ${this.manager.links.length === 0 ? 
              'Cliquez sur "➕ Ajouter un lien" pour commencer' : 
              'Essayez avec d\'autres mots-clés'
            }
          </div>
        </div>
      `;
      return;
    }

    linksList.innerHTML = filteredLinks.map(link => `
      <div class="link-card" data-link-id="${link.id}">
        <div class="link-icon" title="Ouvrir ${link.name}">
          ${link.icon}
        </div>
        <div class="link-info">
          <div class="link-name">${this.escapeHtml(link.name)}</div>
          <div class="link-meta">
            <span class="link-category">${this.getCategoryIcon(link.category)} ${link.category}</span>
          </div>
        </div>
        ${!link.isDefault ? `
          <div class="link-actions">
            <button class="action-btn delete-btn" title="Supprimer">
              🗑️
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  getCategoryIcon(category) {
    const icons = {
      education: '🎓',
      development: '💻',
      communication: '💬',
      design: '🎨',
      productivity: '📝',
      entertainment: '📺',
      custom: '🔗'
    };
    return icons[category] || '🏷️';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Exposer globalement
window.QuickLinksUI = QuickLinksUI;
