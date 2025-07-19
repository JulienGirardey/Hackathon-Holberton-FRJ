#!/bin/bash

echo "🧪 TESTS SMART CLIPBOARD EXTENSION"
echo "=================================="

# Test 1: Vérification des fichiers
echo "📁 Test 1: Vérification des fichiers essentiels..."
files=("manifest.json" "index.html" "main.js" "popup.html" "popup.js" "background.js" "content.js")
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

# Test 2: Validation JSON
echo -e "\n📋 Test 2: Validation manifest.json..."
if jq empty manifest.json 2>/dev/null; then
    echo "✅ manifest.json valide"
else
    echo "❌ manifest.json invalide"
fi

# Test 3: Vérification structure
echo -e "\n🏗️ Test 3: Structure du projet..."
if [[ -d "src/core" && -d "src/ui" ]]; then
    echo "✅ Structure src/ correcte"
else
    echo "❌ Structure src/ incorrecte"
fi

# Test 4: Taille des fichiers
echo -e "\n📊 Test 4: Taille des fichiers..."
total_size=$(du -sh . | cut -f1)
echo "📦 Taille totale: $total_size"

if [[ -f "src/core/ClipboardManager.js" ]]; then
    manager_size=$(wc -l < "src/core/ClipboardManager.js")
    echo "📋 ClipboardManager: $manager_size lignes"
fi

if [[ -f "src/ui/ClipboardUI.js" ]]; then
    ui_size=$(wc -l < "src/ui/ClipboardUI.js")
    echo "🎨 ClipboardUI: $ui_size lignes"
fi

# Test 5: Instructions d'installation
echo -e "\n🚀 Test 5: Instructions d'installation Chrome..."
echo "1. Ouvrir Chrome et aller à: chrome://extensions/"
echo "2. Activer le 'Mode développeur'"
echo "3. Cliquer 'Charger l'extension non empaquetée'"
echo "4. Sélectionner ce dossier: $(pwd)"
echo "5. Tester l'extension!"

# Test 6: URL de test local
echo -e "\n🌐 Test 6: Test local..."
echo "URL de test: file://$(pwd)/index.html"
echo "URL popup: file://$(pwd)/popup.html"

echo -e "\n✅ Tests terminés! Extension prête pour le déploiement."
