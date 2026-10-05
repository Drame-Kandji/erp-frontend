# NOLI CORE Frontend

Frontend web de **NOLI CORE**, ERP sectoriel destiné aux entreprises du BTP,
des mines et des carrières.

L’application est développée avec React et TypeScript. Elle fournit une
interface par rôle pour les profils `ADMIN`, `RH` et `EMPLOYEE`, consomme le
backend Django REST Framework et utilise TanStack Query pour toutes les
données serveur.

## État du projet

Le frontend est actuellement organisé autour des modules suivants :

- **Authentification de démonstration** : connexion locale par rôle, en attente
	des endpoints JWT du backend.
- **CORE connecté à Django** : Organisations et Sites utilisent les endpoints
	REST réels, sans service mock.
- **RH en démonstration** : Employés, contrats et documents sont préparés avec
	des données simulées jusqu’à la disponibilité des endpoints backend.
- **Pointage en démonstration** : Présences et Timesheets utilisent un service
	mocké indépendant.

Les données des Organisations et des Sites ne sont pas stockées dans Zustand et
ne sont pas mockées. Elles sont chargées et invalidées par TanStack Query.

## Stack technique

| Technologie | Utilisation |
| --- | --- |
| React 19 | Interface utilisateur |
| TypeScript strict | Typage statique |
| Vite | Serveur de développement et build |
| React Router | Routage et routes protégées |
| TanStack Query v5 | Cache, requêtes et mutations serveur |
| Axios | Client HTTP unique |
| React Hook Form | Gestion des formulaires |
| Zod | Validation des formulaires |
| Zustand | Session utilisateur et état client uniquement |
| Lucide React | Icônes |
| ESLint | Qualité statique |

## Prérequis

- Node.js 20 ou supérieur
- npm 10 ou supérieur
- Backend Django disponible dans `../erp-backend`
- Python 3.14 et PostgreSQL 17 pour lancer le backend

Vérifier les versions :

```bash
node --version
npm --version
```

## Installation

Depuis le dossier frontend :

```bash
cd erp-frontend
npm install
```

## Configuration

Le client HTTP utilise par défaut :

```text
/api/v1
```

En développement, Vite redirige automatiquement `/api` vers :

```text
http://127.0.0.1:8000
```

### Variables d’environnement

Créer un fichier `.env.local` dans `erp-frontend` si nécessaire :

```env
# Optionnel en développement : le proxy Vite est utilisé par défaut.
VITE_API_URL=/api/v1
```

Pour un frontend déployé séparément du backend, utiliser une URL absolue :

```env
VITE_API_URL=https://............../api/v1
```

Ne jamais placer de secret ou de mot de passe dans une variable `VITE_*`.
Les variables Vite sont exposées au navigateur.

## Lancer le frontend

```bash
npm run dev
```

L’application est généralement disponible sur :

```text
http://127.0.0.1:5173/
```

Si le port est déjà utilisé, Vite choisit automatiquement un autre port. Il
faut alors ouvrir l’URL indiquée dans le terminal.

## Lancer le projet complet

Le frontend dépend du backend pour les Organisations et les Sites.

### Terminal 1 : backend Django

```bash
cd erp-backend
source .venv/bin/activate
docker compose up -d db
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Le backend doit répondre à :

```bash
curl http://127.0.0.1:8000/api/v1/health/
```

Documentation interactive :

```text
http://127.0.0.1:8000/api/docs/
```

### Terminal 2 : frontend React

```bash
cd erp-frontend
npm install
npm run dev
```

### Vérification rapide

1. Ouvrir l’URL Vite affichée dans le terminal.
2. Se connecter avec un compte de démonstration.
3. Ouvrir **Organisations** ou **Sites** depuis la sidebar ADMIN.
4. Vérifier que le badge indique `CORE API · CONNECTÉE`.
5. Vérifier que les données viennent du backend Django.

## Comptes de démonstration

L’authentification JWT backend n’étant pas encore disponible, la connexion
actuelle utilise des comptes locaux de démonstration.

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| ADMIN | `admin@nolicore.local` | `admin123` |
| RH | `rh@nolicore.local` | `rh123` |
| EMPLOYEE | `employee@nolicore.local` | `employee123` |

Ces comptes ne créent aucun utilisateur dans Django. Ils servent uniquement à
tester les layouts, la navigation et le RBAC côté frontend.

## Rôles et navigation

### ADMIN

- Tableau de bord
- Organisations
- Sites
- Utilisateurs et rôles
- Journal d’audit
- Employés
- Mon profil
- Paramètres

### RH

- Tableau de bord RH
- Employés
- Contrats et documents
- Présences
- Timesheets
- Mon profil

### EMPLOYEE

- Tableau de bord personnel
- Timesheets personnelles
- Mon profil

Le frontend masque et protège les écrans selon le rôle. Le backend Django reste
l’autorité finale pour la sécurité et les permissions.

## Architecture du frontend

```text
src/
├── app/
│   ├── providers/
│   │   └── AppProviders.tsx       # QueryClient global
│   └── router/
│       ├── AppRouter.tsx          # Routes applicatives
│       └── ProtectedRoute.tsx     # Protection par authentification/rôle
│
├── modules/
│   ├── auth/                      # Connexion de démonstration
│   ├── dashboard/                 # Dashboards par rôle
│   ├── admin/                     # Utilisateurs et rôles
│   ├── core/
│   │   ├── organizations/
│   │   │   ├── domain/             # Types métier
│   │   │   ├── hooks/              # Hooks TanStack Query
│   │   │   ├── pages/              # Liste, création, détail, édition
│   │   │   └── services/           # Service API REST
│   │   └── sites/
│   │       ├── components/         # Formulaire Site
│   │       ├── domain/
│   │       ├── hooks/
│   │       ├── pages/              # Liste, création, détail, édition
│   │       └── services/
│   ├── hr/                         # Employés et services RH mockés
│   └── attendance/                 # Présence et Timesheets mockées
│
├── shared/
│   ├── auth/                        # Permissions RBAC
│   ├── components/                  # DataTable, PermissionGate, etc.
│   ├── constants/                   # Navigation et comptes de démo
│   ├── stores/                      # Store Zustand de session
│   └── types/                       # Types partagés
│
└── lib/
		└── api/
				├── client.ts                # Client Axios unique
				└── service-mode.ts          # Compatibilité modules mockés futurs
```

`App.tsx` ne contient pas de logique métier. Il compose les providers et le
routeur applicatif.

## Client HTTP

Tous les appels HTTP passent par :

```text
src/lib/api/client.ts
```

Ce client :

- définit `baseURL` avec `VITE_API_URL` ou `/api/v1` ;
- ajoute automatiquement le token `noli_access_token` s’il existe ;
- centralise la gestion des réponses `401` ;
- fournit `getApiErrorMessage` pour les erreurs communes.

Les composants React n’appellent jamais Axios directement.



## API Organisations consommée

Base URL : `/api/v1/organizations/`

| Méthode | Endpoint | Utilisation |
| --- | --- | --- |
| GET | `/organizations/?page=1` | Liste paginée |
| POST | `/organizations/` | Création |
| GET | `/organizations/{id}/` | Détail |
| PUT | `/organizations/{id}/` | Remplacement complet |
| PATCH | `/organizations/{id}/` | Mise à jour partielle |
| DELETE | `/organizations/{id}/` | Suppression |

Le formulaire envoie les champs backend suivants :

```json
{
	"name": "NOLI CORE",
	"code": "NOLI",
	"description": "Organisation racine",
	"status": "active",
	"configuration": {
		"timezone": "Africa/Dakar",
		"language": "fr",
		"currency": "XOF"
	}
}
```

## API Sites consommée

Base URL : `/api/v1/sites/`

| Méthode | Endpoint | Utilisation |
| --- | --- | --- |
| GET | `/sites/?page=1` | Liste paginée |
| GET | `/sites/?organization={uuid}` | Filtre organisation |
| GET | `/sites/?status=active` | Filtre statut |
| POST | `/sites/` | Création |
| GET | `/sites/{id}/` | Détail |
| PUT | `/sites/{id}/` | Remplacement complet |
| PATCH | `/sites/{id}/` | Mise à jour partielle |
| DELETE | `/sites/{id}/` | Suppression |

Le formulaire Site envoie :

```json
{
	"organization": "3aa35ffe-5db9-4b3f-b358-21eb2d720582",
	"name": "Site Dakar",
	"code": "DKR",
	"address": "Route de la Corniche, Dakar",
	"latitude": "14.716700",
	"longitude": "-17.467700",
	"status": "active"
}
```

L’organisation affichée dans la liste et le détail est résolue avec :

```text
GET /api/v1/organizations/{organizationId}/
```

## Formulaires et validation

Les formulaires utilisent :

- React Hook Form pour l’état et la soumission ;
- Zod pour les validations côté client ;
- les erreurs DRF pour afficher les erreurs backend par champ.

Règles Sites :

- une organisation est obligatoire ;
- le nom et le code sont obligatoires ;
- latitude et longitude doivent être fournies ensemble ;
- latitude est comprise entre `-90` et `90` ;
- longitude est comprise entre `-180` et `180` ;
- le code est unique dans l’organisation côté backend.

## Commandes disponibles

```bash
# Serveur de développement
npm run dev

# Build TypeScript + Vite
npm run build

# Vérification ESLint
npm run lint

# Prévisualisation du build de production
npm run preview
```

## Build de production

```bash
npm run build
npm run preview
```

Le dossier généré est `dist/`.

Pour un déploiement séparé du backend, définir avant le build :

```bash
VITE_API_URL=https://............./api/v1 npm run build
```

## Dépannage

### Le frontend affiche une page blanche

1. Arrêter les anciennes instances Vite.
2. Supprimer le cache Vite.
3. Relancer le serveur.

```bash
pkill -f vite || true
rm -rf node_modules/.vite node_modules/.vite-temp
npm run dev
```

### Erreur CORS vers Django

En développement, utiliser l’URL Vite et non directement le port Django :

```text
http://127.0.0.1:5173/
```

Le proxy Vite transmet `/api` vers `http://127.0.0.1:8000`.

### `ENOSPC: System limit for number of file watchers reached`

Le système Linux n’a plus assez de watchers disponibles. Le serveur peut
parfois continuer à répondre, mais le HMR devient instable. Fermer les
instances Vite inutiles et, si nécessaire, augmenter temporairement la limite :

```bash
cat /proc/sys/fs/inotify/max_user_watches
sudo sysctl fs.inotify.max_user_watches=524288
```

### Les Organisations ou Sites ne chargent pas

Vérifier que Django répond :

```bash
curl http://127.0.0.1:8000/api/v1/health/
curl 'http://127.0.0.1:8000/api/v1/organizations/?page=1'
curl 'http://127.0.0.1:8000/api/v1/sites/?page=1'
```

## Règles de développement

- Ne pas appeler Axios depuis un composant.
- Ne pas stocker les données backend dans Zustand.
- Ajouter les nouvelles requêtes dans un service et un hook TanStack Query.
- Garder les composants UI indépendants de la source de données.
- Utiliser les contrats OpenAPI/Django comme source de vérité.
- Ne jamais présenter une donnée mockée comme une donnée backend réelle.
- Protéger les écrans par rôle, sans considérer le frontend comme une autorité
	de sécurité.

## Workflow recommandé

```bash
git checkout -b feature/nom-de-la-fonctionnalite
npm install
npm run lint
npm run build
```

Avant une pull request :

1. vérifier les parcours ADMIN/RH/EMPLOYEE concernés ;
2. vérifier les états chargement, erreur et vide ;
3. vérifier le contrat réseau dans l’onglet Network ;
4. lancer `npm run lint` ;
5. lancer `npm run build`.

## Documentation backend

- Swagger UI : `http://127.0.0.1:8000/api/docs/`
- Schéma OpenAPI : `http://127.0.0.1:8000/api/schema/`
- Health check : `http://127.0.0.1:8000/api/v1/health/`
- Documentation backend : `../erp-backend/docs/`
