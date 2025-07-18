# 📋 Smart Clipboard Manager - Extension Chrome

## 🎯 Description
Extension Chrome pour gérer intelligemment votre historique de presse-papiers avec catégorisation automatique, favoris et recherche.

## 🚀 Installation de l'extension

### Méthode 1: Mode développeur (Recommandé pour le développement)

1. **Builder l'application React**
   ```bash
   cd holberton-dashboard
   npm run build
   ```

2. **Ouvrir Chrome et aller dans les extensions**
   - Ouvrir Chrome
   - Aller à `chrome://extensions/`
   - Activer le "Mode développeur" (en haut à droite)

3. **Charger l'extension**
   - Cliquer sur "Charger l'extension non empaquetée"
   - Sélectionner le dossier `holberton-dashboard` (celui contenant le `manifest.json`)
   - L'extension apparaît dans la barre d'outils

### Méthode 2: Application web standalone

1. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Ouvrir dans le navigateur**
   - Aller à `http://localhost:5173`
   - Utiliser comme application web normale

## 🔧 Configuration de l'extension

### Permissions requises
- **storage**: Sauvegarder l'historique localement
- **activeTab**: Lire le contenu des onglets actifs  
- **clipboardRead/Write**: Accéder au presse-papiers système

### Raccourcis clavier (à configurer dans Chrome)
- `Ctrl+Shift+V` - Ouvrir le gestionnaire de presse-papiers
- `Ctrl+Shift+C` - Lire le presse-papiers actuel

## 🎨 Fonctionnalités

### ✅ Fonctionnalités de base
- 📋 **Historique automatique** du presse-papiers
- 🔍 **Recherche intelligente** dans l'historique
- ⭐ **Système de favoris**
- 🏷️ **Catégorisation automatique** (URL, Email, Code, etc.)
- 📊 **Statistiques d'utilisation**
- 💾 **Export/Import** de données
- 🌙 **Thème sombre/clair**

### 🔮 Détection automatique des types
- **URLs** - Détection des liens web
- **Emails** - Reconnaissance des adresses email
- **Code** - Identification du code source
- **JSON** - Validation des données JSON
- **HTML** - Détection du markup HTML

### 📁 Catégories disponibles
- 💼 **Travail** - Contenu professionnel
- 👤 **Personnel** - Éléments personnels
- 💻 **Code** - Snippets et code source
- 🔗 **Liens** - URLs et références web
- ⏰ **Temporaire** - Contenu temporaire

## 🛠️ Développement

### Structure du projet pour l'extension
```
holberton-dashboard/
├── manifest.json          # Manifest de l'extension Chrome
├── popup.html             # Interface de la popup
├── background.js          # Script de background
├── content.js             # Script de contenu
├── dist/                  # Build de l'application React
├── src/                   # Code source React
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── data/
└── package.json
```

### Scripts de développement
```bash
# Développement de l'interface React
npm run dev

# Build pour l'extension
npm run build

# Linting
npm run lint
```

### Test de l'extension
1. Modifier le code React
2. Lancer `npm run build`
3. Recharger l'extension dans Chrome (`chrome://extensions/`)
4. Tester les nouvelles fonctionnalités

## 📱 Utilisation

### Interface principale
1. **Cliquer sur l'icône** de l'extension dans la barre d'outils
2. **Lire le presse-papiers** automatiquement ou manuellement
3. **Rechercher** dans l'historique avec la barre de recherche
4. **Filtrer** par catégorie ou trier par usage/date
5. **Cliquer sur un élément** pour le copier à nouveau

### Gestion des favoris
- **Étoile vide** ☆ - Ajouter aux favoris
- **Étoile pleine** ⭐ - Retirer des favoris
- **Section dédiée** - Accès rapide aux favoris

### Actions sur les éléments
- 📋 **Copier** - Remettre dans le presse-papiers
- ⭐ **Favori** - Marquer/démarquer comme favori  
- ✏️ **Modifier** - Éditer le contenu
- 🗑️ **Supprimer** - Effacer de l'historique

## ⚙️ Paramètres avancés

### Configuration disponible
- **Limite d'éléments** - Nombre max d'items en historique
- **Auto-suppression** - Supprimer après X jours
- **Notifications** - Alertes pour nouveaux clips
- **Détection auto** - Lecture automatique du presse-papiers
- **Catégorie par défaut** - Classification automatique

### Sauvegarde et restauration
- **Export JSON** - Sauvegarder tous les clips
- **Import JSON** - Restaurer depuis une sauvegarde
- **Stockage local** - Données gardées dans Chrome

## 🔒 Sécurité et vie privée

### Données stockées localement
- ✅ **Stockage local uniquement** - Pas de serveur externe
- ✅ **Chiffrement possible** - Option pour sécuriser les données
- ✅ **Contrôle utilisateur** - Gestion complète des données

### Permissions minimales
- 🔒 **Pas d'accès réseau** - Fonctionne hors ligne
- 🔒 **Pas de partage** - Données privées
- 🔒 **Accès sur demande** - Permissions explicites

## 🚀 Prochaines fonctionnalités

### À implémenter
- 🔄 **Synchronisation** entre appareils
- 📝 **Édition avancée** avec formatage
- 🏷️ **Tags personnalisés**
- ⌨️ **Raccourcis clavier** configurables
- 📸 **Capture d'images** du presse-papiers
- 🔍 **Recherche par regex**
- 📈 **Analytics d'utilisation**

---

**🎉 Votre extension Smart Clipboard Manager est prête !**

Une solution complète pour gérer efficacement votre presse-papiers avec une interface moderne et des fonctionnalités avancées.
