# Application de Gestion des Utilisateurs

Une application web complète développée avec React, TypeScript, TailwindCSS et ShadCN UI pour la gestion des utilisateurs avec authentification JWT.

## 🚀 Fonctionnalités

- **Authentification JWT** : Connexion sécurisée avec tokens d'accès et de rafraîchissement
- **CRUD Utilisateurs** : Création, lecture, modification et suppression d'utilisateurs
- **Interface responsive** : Design adaptatif pour mobile, tablette et desktop
- **Design moderne** : Interface élégante avec palette de couleurs dark blue
- **Gestion des erreurs** : Notifications toast pour les succès et erreurs
- **Sécurité** : Intercepteurs Axios pour la gestion automatique des tokens

## 🛠️ Technologies Utilisées

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : TailwindCSS, ShadCN UI
- **Routing** : React Router DOM
- **HTTP Client** : Axios avec intercepteurs
- **Formulaires** : React Hook Form avec Zod validation
- **Notifications** : Toast notifications
- **Icons** : Lucide React

## 🎨 Design System

L'application utilise un design system cohérent avec :
- **Couleur principale** : Dark Blue (#1e3a8a et variantes)
- **Gradients** : Dégradés élégants pour les boutons et cartes
- **Ombres** : Effets d'ombrage doux et moderne
- **Animations** : Transitions fluides et hover effects
- **Typographie** : Police system avec anti-aliasing

## ⚙️ Configuration Backend

L'application est conçue pour fonctionner avec une API Spring Boot. Voici les endpoints requis :

### Authentification
- `POST /auth/login` - Connexion avec username/password
- `POST /auth/getToken` - Rafraîchissement du token avec refreshToken

### Gestion des Utilisateurs
- `GET /user/all` - Récupérer tous les utilisateurs
- `GET /user/{id}` - Récupérer un utilisateur par ID
- `POST /user/create` - Créer un nouvel utilisateur
- `PUT /user/{id}` - Mettre à jour un utilisateur
- `DELETE /user/{id}` - Supprimer un utilisateur

## 🚦 Installation et Démarrage

1. **Cloner le repository**
   ```bash
   git clone <votre-repo-url>
   cd gestion-utilisateurs
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créer un fichier `.env` à la racine du projet :
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   Ouvrir [http://localhost:8080](http://localhost:8080) dans votre navigateur

## 📱 Utilisation

### Connexion
1. Accéder à la page de connexion
2. Saisir les identifiants (username/password)
3. Cliquer sur "Se connecter"

### Gestion des Utilisateurs
1. Une fois connecté, accéder au dashboard
2. **Ajouter** : Cliquer sur "Ajouter" et remplir le formulaire
3. **Modifier** : Cliquer sur l'icône crayon dans la ligne de l'utilisateur
4. **Supprimer** : Cliquer sur l'icône poubelle et confirmer la suppression
5. **Déconnexion** : Cliquer sur "Déconnexion" dans la navbar

## 🔧 Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Compiler l'application pour la production
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Lancer le linting avec ESLint

## 🔒 Sécurité

- **JWT Authentication** : Gestion sécurisée des tokens d'accès
- **Auto-refresh** : Rafraîchissement automatique des tokens expirés
- **Protected Routes** : Routes protégées avec redirection automatique
- **Validation** : Validation des formulaires côté client avec Zod

## 📊 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants ShadCN UI
│   ├── LoginForm.tsx   # Formulaire de connexion
│   ├── UserTable.tsx   # Table des utilisateurs
│   ├── UserModal.tsx   # Modal d'ajout/modification
│   └── Navbar.tsx      # Barre de navigation
├── pages/              # Pages de l'application
│   ├── Login.tsx       # Page de connexion
│   └── Dashboard.tsx   # Page principale
├── services/           # Services API
│   ├── api.ts          # Configuration Axios
│   ├── auth.ts         # Service d'authentification
│   └── userService.ts  # Service utilisateurs
├── types/              # Types TypeScript
│   └── auth.ts         # Types d'authentification
└── lib/                # Utilitaires
    ├── utils.ts        # Utilitaires généraux
    └── env.ts          # Configuration environnement
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🐛 Support

Pour signaler un bug ou demander une fonctionnalité, veuillez ouvrir une issue sur GitHub.

---

Développé avec ❤️ en utilisant React et TypeScript