# 🎬 CineApp — Application Web de Cinéma

CineApp est une application web de réservation de places de cinéma construite avec **Next.js 16** (App Router), **React 19**, **TypeScript** et **Tailwind CSS 4**. Elle s'appuie sur une **architecture micro-services** où chaque fonctionnalité métier est gérée par un service indépendant.

---

## 📐 Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        Navigateur (Client)                      │
│              Next.js App — React 19 / Tailwind CSS 4            │
└──────────────┬──────────────┬──────────────┬────────────────────┘
               │              │              │
               ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │  API     │   │  API     │   │  API         │
        │  Films   │   │  Auth    │   │  Séances     │
        │  :8000   │   │  :3000   │   │  :8082       │
        └──────────┘   └──────────┘   └──────────────┘
           Python         Node.js       Java (Spring)
```

CineApp (ce dépôt) est le **front-end** et le **BFF** (Backend-For-Frontend). Il communique avec trois micro-services distants via des appels REST. Les réservations sont stockées localement côté serveur Next.js dans un fichier JSON.

---

## 🔌 Micro-services

### 1. Service Films — `FILMS_SERVICE`

| Élément       | Détail                                   |
| ------------- | ---------------------------------------- |
| **Techno**    | Python (FastAPI / Django)                |
| **URL**       | `http://192.168.0.185:8000`              |
| **Variable**  | `NEXT_PUBLIC_FILMS_API_URL`              |

**Endpoints consommés :**

| Méthode | Route                          | Description                        |
| ------- | ------------------------------ | ---------------------------------- |
| GET     | `/api/movies/popular`          | Films populaires (paginé)          |
| GET     | `/api/movies/top-rated`        | Films les mieux notés              |
| GET     | `/api/movies/now-playing`      | Films actuellement en salle        |
| GET     | `/api/movies/upcoming`         | Films à venir                      |
| GET     | `/api/movies/:id`              | Détails d'un film                  |
| GET     | `/api/movies/:id/credits`      | Casting et équipe technique        |
| GET     | `/api/movies/:id/videos`       | Bandes-annonces (YouTube)          |
| GET     | `/api/search/movies`           | Recherche de films (`?q=...`)      |
| GET     | `/api/genres/movies`           | Liste des genres                   |

Les données proviennent à l'origine de **TMDB** (The Movie Database) et sont servies par le micro-service Python.

---

### 2. Service Authentification — `AUTH_SERVICE`

| Élément       | Détail                                    |
| ------------- | ----------------------------------------- |
| **Techno**    | Node.js (Express / NestJS)                |
| **URL**       | `http://192.168.0.78:3000`                |
| **Variable**  | `NEXT_PUBLIC_AUTH_API_URL`                |

**Endpoints consommés :**

| Méthode | Route                            | Description                             |
| ------- | -------------------------------- | --------------------------------------- |
| POST    | `/api/v1/auth/login`             | Connexion (retourne `access_token` + `refresh_token`) |
| POST    | `/api/v1/auth/register`          | Inscription                             |
| POST    | `/api/v1/auth/logout`            | Déconnexion                             |
| POST    | `/api/v1/auth/refresh`           | Renouvellement du token                 |
| GET     | `/api/v1/auth/check-availability`| Vérification dispo username / email     |
| GET     | `/api/v1/users/me`               | Profil de l'utilisateur connecté        |

L'authentification utilise des **JWT** (JSON Web Tokens). Les tokens sont stockés côté client dans le `localStorage`.

---

### 3. Service Séances — `SEANCES_SERVICE`

| Élément       | Détail                                    |
| ------------- | ----------------------------------------- |
| **Techno**    | Java (Spring Boot) — base H2 en mémoire  |
| **URL**       | `http://192.168.27.79:8082`               |
| **Variable**  | `NEXT_PUBLIC_SEANCES_API_URL`             |

**Endpoints consommés :**

| Méthode | Route                                  | Description                          |
| ------- | -------------------------------------- | ------------------------------------ |
| GET     | `/seances`                             | Toutes les séances                   |
| POST    | `/seances`                             | Créer une séance                     |
| PUT     | `/seances/:id`                         | Modifier une séance                  |
| DELETE  | `/seances/:id`                         | Supprimer une séance                 |
| POST    | `/seances/:id/reserver?nbPlaces=X`     | Réserver des places sur une séance   |

> **Note :** le service utilise une base H2 **en mémoire** ; les données sont réinitialisées à chaque redémarrage. Le front-end génère automatiquement des séances (seed) si aucune n'existe pour un film donné.

---

### 4. Stockage des réservations (local)

Les réservations ne sont pas gérées par un micro-service externe. Elles sont persistées **côté serveur Next.js** dans un fichier JSON (`data/reservations.json`). Ce choix simplifie le développement ; en production, il faudrait les remplacer par une vraie base de données ou un micro-service dédié.

---

## 🗂️ Structure du projet

```
cineapp/
├── app/                          # App Router Next.js
│   ├── (auth)/                   # Routes d'authentification (login, register)
│   ├── api/                      # Routes API (BFF)
│   │   ├── films/                #   Proxy vers le service Films
│   │   ├── seances/              #   Proxy vers le service Séances
│   │   ├── reservations/         #   CRUD réservations (stockage local)
│   │   └── profile/              #   Proxy vers le service Auth (profil)
│   ├── films/                    # Pages catalogue de films
│   ├── reservations/             # Pages réservation
│   ├── profile/                  # Pages profil utilisateur
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil
│   ├── error.tsx                 # Gestion d'erreur globale (par segment)
│   └── global-error.tsx          # Gestion d'erreur fatale (layout racine)
├── components/
│   ├── auth/                     # Formulaires login / register / PrivateRoute
│   ├── films/                    # FilmCard, FilmDetails, FilmGrid, FilmList
│   ├── layout/                   # Header, Footer, Navigation, ThemeToggle
│   ├── profile/                  # Contenu du profil
│   ├── reservations/             # Sélection de sièges, créneaux, formulaire
│   └── ui/                       # Composants réutilisables (Button, Card, Input…)
├── config/
│   ├── api.ts                    # URLs des micro-services
│   └── colors.ts                 # Palette de couleurs
├── context/
│   ├── AuthContext.tsx            # Contexte d'authentification (JWT)
│   └── ThemeContext.tsx           # Contexte thème clair / sombre
├── lib/
│   ├── api/                      # Clients API typés (films, auth, séances, réservations)
│   ├── types/                    # Interfaces TypeScript
│   └── utils/                    # Fonctions utilitaires
└── public/                       # Fichiers statiques
```

---

## 🔄 Flux de communication

### Consultation des films

```
Utilisateur → Page /films → filmsAPI.getPopularMovies()
                             → GET http://<FILMS_SERVICE>/api/movies/popular
                             ← JSON { results: [...], page, total_pages }
```

### Authentification

```
Utilisateur → LoginForm → authAPI.login({ username, password })
                           → POST http://<AUTH_SERVICE>/api/v1/auth/login
                           ← { access_token, refresh_token }
              → stockage localStorage + mise à jour AuthContext
```

### Réservation de places

```
1. Utilisateur choisit un film       → /films/:id
2. Chargement des séances            → seancesAPI.getOrCreateSeancesByFilm(filmId)
                                       → GET http://<SEANCES_SERVICE>/seances
                                       → (seed POST /seances si vide)
3. Sélection créneaux + sièges       → SeatSelector + TimeSlotSelector
4. Confirmation réservation           → POST /api/seances/:id/reserver?nbPlaces=X
                                       (décrémente les places côté micro-service)
                                     → POST /api/reservations
                                       (sauvegarde locale côté Next.js)
5. Page de confirmation              → /reservations/confirmation
```

---

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_FILMS_API_URL=http://192.168.0.185:8000
NEXT_PUBLIC_AUTH_API_URL=http://192.168.0.78:3000
NEXT_PUBLIC_SEANCES_API_URL=http://192.168.27.79:8082
```

Si les variables ne sont pas définies, les URLs par défaut codées dans `config/api.ts` seront utilisées.

---

## 🚀 Installation et lancement

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd cineapp

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build de production
npm run build
npm start
```

L'application sera accessible sur **http://localhost:3000**.

---

## 🛠️ Stack technique

| Technologie       | Version  | Usage                             |
| ----------------- | -------- | --------------------------------- |
| Next.js           | 16.1.4   | Framework React full-stack        |
| React             | 19.2.3   | Bibliothèque UI                   |
| TypeScript        | 5.x      | Typage statique                   |
| Tailwind CSS      | 4.x      | Styles utilitaires                |
| Framer Motion     | 12.x     | Animations                        |
| ESLint            | 9.x      | Linting                           |

---

## 🛡️ Gestion des erreurs et résilience

L'application est conçue pour être résiliente face à l'indisponibilité des micro-services :

- **Gestion d'erreur globale** : les fichiers `error.tsx` et `global-error.tsx` capturent toute erreur non gérée et affichent un message convivial à l'utilisateur.
- **Messages génériques** : lorsqu'un micro-service est inaccessible ou renvoie une erreur, l'utilisateur voit un message du type *« Cette fonctionnalité est temporairement indisponible »* au lieu de détails techniques.
- **Dégradation gracieuse** : les erreurs de chargement de données secondaires (casting, vidéos…) sont silencieuses — le reste de la page s'affiche normalement.
- **Pas d'exposition de données internes** : les messages d'erreur API, codes de statut et stack traces ne sont jamais transmis au navigateur.

---

## 📄 Licence

Projet académique — usage interne uniquement.
