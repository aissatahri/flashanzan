# 🧮 FlashAnzan - Mental Calculation Training# FlashAnzan



[![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)](https://play.google.com/store/apps/details?id=com.azmicro.app)**FlashAnzan** est une application d'entraînement au calcul mental basée sur la méthode japonaise Anzan. Les nombres apparaissent rapidement à l'écran et l'utilisateur doit calculer leur somme.

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)](https://angular.io/)

[![Capacitor](https://img.shields.io/badge/Capacitor-6-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)## 🎯 Fonctionnalités

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

- **3 niveaux de difficulté** :

FlashAnzan is a mental calculation training application based on the Japanese Anzan (mental arithmetic) method. Numbers flash on screen rapidly and users must calculate their sum.  - **Facile** : 5 nombres à 1 chiffre (1,5s par nombre)

  - **Moyen** : 10 nombres à 2 chiffres (1s par nombre)

<div align="center">  - **Difficile** : 15 nombres à 3 chiffres (0,5s par nombre)

  <img src="docs/screenshot-home.png" alt="FlashAnzan Home" width="250"/>

  <img src="docs/screenshot-game.png" alt="FlashAnzan Game" width="250"/>- **Interface intuitive** : Design moderne et responsive

  <img src="docs/screenshot-result.png" alt="FlashAnzan Result" width="250"/>- **Système de score** : Suivez vos progrès

</div>- **Feedback immédiat** : Vérification instantanée de vos réponses

- **Animations fluides** : Expérience utilisateur agréable

## ✨ Features

## 🚀 Installation

### 🎯 Four Difficulty Levels

- **Easy**: 5 numbers with 1 digit### Prérequis

- **Medium**: 10 numbers with 2 digits

- **Hard**: 15 numbers with 3 digits- Node.js (v14 ou supérieur)

- **Custom**: Configure your own challenge- npm (v6 ou supérieur)

- Angular CLI

### ⚙️ Custom Mode

- Number of digits: 1 to 5### Étapes d'installation

- Number of operations: 5 to 50

- Display time: 200ms to 3s per number1. Clonez le dépôt :

- Operation type: Addition, Subtraction, or Mixed```bash

git clone <url-du-repo>

### 🌍 Multilingual Supportcd flashanzan

- French (Français)```

- Arabic (العربية) with RTL support

- English2. Installez les dépendances :

```bash

### 🔊 Audio Feedbacknpm install

- Sound effects on number display```

- Audio feedback for concentration

3. Lancez le serveur de développement :

### 📱 Responsive Design```bash

- Works on all screen sizesng serve

- Smooth animations```

- Elegant modals

- Retry failed sequences4. Ouvrez votre navigateur et accédez à `http://localhost:4200`



## 🚀 Getting Started## 🎮 Comment jouer



### Prerequisites1. **Choisissez votre niveau** : Sélectionnez un niveau de difficulté (Facile, Moyen ou Difficile)

2. **Cliquez sur "Commencer"** : Les nombres vont commencer à apparaître

- Node.js 18+ and npm3. **Mémorisez les nombres** : Concentrez-vous et additionnez mentalement

- Angular CLI 18+4. **Entrez votre réponse** : Une fois tous les nombres affichés, tapez la somme

- For Android build: Android Studio, JDK 175. **Validez** : Cliquez sur "Valider" ou appuyez sur Entrée

6. **Consultez le résultat** : Voyez si votre réponse est correcte et améliorez votre score!

### Installation

## 🛠️ Commandes de développement

1. **Clone the repository**

```bash```bash

git clone https://github.com/aissatahri/flashanzan.git# Lancer le serveur de développement

cd flashanzanng serve

```

# Lancer le serveur sur un port spécifique

2. **Install dependencies**ng serve --port 4201

```bash

npm install# Compiler le projet

```ng build



3. **Run the development server**# Exécuter les tests

```bashng test

ng serve

```# Générer un nouveau composant

ng generate component nom-du-composant

Navigate to `http://localhost:4200/````



### Build for Production## 📁 Structure du projet



#### Web Build```

```bashflashanzan/

ng build --configuration production├── src/

```│   ├── app/

│   │   ├── game/              # Composant principal du jeu

#### Android APK│   │   ├── services/          # Services (GameService)

```bash│   │   ├── app.component.*    # Composant racine

# Windows│   │   └── app.module.ts      # Module principal

.\build-apk.ps1│   ├── assets/                # Ressources statiques

│   ├── environments/          # Configuration d'environnement

# Linux/Mac│   └── styles.css             # Styles globaux

./build-apk.sh├── angular.json               # Configuration Angular

```├── package.json               # Dépendances npm

└── README.md                  # Ce fichier

The APK will be generated in `android/app/build/outputs/apk/release/````



#### Android App Bundle (for Play Store)## 🎨 Technologies utilisées

```bash

# Windows- **Angular 14** : Framework frontend

.\build-release.ps1- **TypeScript** : Langage de programmation

```- **RxJS** : Programmation réactive

- **CSS3** : Styles et animations

The AAB will be generated in `android/app/build/outputs/bundle/release/`

## 📝 Méthodologie Anzan

## 📱 Download

L'Anzan (暗算) est une méthode japonaise de calcul mental qui utilise un boulier imaginaire (soroban) pour effectuer des calculs rapides. Cette application vous aide à développer :

<a href="https://play.google.com/store/apps/details?id=com.azmicro.app">

  <img alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" width="200"/>- La vitesse de calcul mental

</a>- La concentration

- La mémoire de travail

## 🎓 About Anzan Method- La visualisation des nombres



Anzan (暗算) is a Japanese mental calculation technique traditionally practiced with the abacus (soroban). This app helps you train your mental arithmetic by:## 🤝 Contribution



1. Visualizing numbers rapidlyLes contributions sont les bienvenues! N'hésitez pas à :

2. Calculating sums mentally

3. Improving calculation speed1. Forker le projet

4. Enhancing concentration2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)

3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)

## 🏗️ Project Structure4. Pusher vers la branche (`git push origin feature/AmazingFeature`)

5. Ouvrir une Pull Request

```

flashanzan/## 📄 Licence

├── src/

│   ├── app/Ce projet est sous licence MIT.

│   │   ├── game/              # Game component

│   │   ├── services/          # Game and translation services## 👤 Auteur

│   │   └── app.component.*    # Main component

│   ├── assets/                # Static assetsCréé avec ❤️ pour l'apprentissage du calcul mental

│   └── environments/          # Environment configs

├── android/                   # Capacitor Android project---

├── docs/                      # Documentation and guides

└── build-*.ps1|sh            # Build scripts**Bon entraînement! 🧮**

```

## 🛠️ Technologies

- **Frontend**: Angular 18 (Standalone Components)
- **Mobile**: Capacitor 6
- **Language**: TypeScript (Strict Mode)
- **Styling**: CSS with responsive design
- **Audio**: HTML5 Audio API
- **i18n**: Custom translation service

## 📄 Documentation

- [APK Quick Start Guide](APK_QUICK_START.md)
- [Complete APK Build Guide](BUILD_APK_GUIDE.md)
- [Google Play Store Publication Guide](GUIDE_PUBLICATION_PLAY_STORE.md)
- [Complete Publication Process](PUBLICATION_PLAY_STORE_COMPLETE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Stats

- **Package**: com.azmicro.app
- **Version**: 1.0 (versionCode 2)
- **Distribution**: 177 countries, 19,618 devices
- **Published**: November 9, 2025

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Azmicro**
- GitHub: [@aissatahri](https://github.com/aissatahri)

## 🙏 Acknowledgments

- Inspired by the Japanese Anzan mental calculation method
- Built with Angular and Capacitor
- Sound effects for enhanced user experience

---

**⭐ If you like FlashAnzan, give it a star on GitHub!**
