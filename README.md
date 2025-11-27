# Projet Kubernetes - Application Web + Base de Données

## 👥 Auteurs
- **Damien LÉON**
- **Gianna QUENUM**
- **Michael YAGHI**
- **Nikos THOUMYRE**

---

## 📝 Description du Projet
Ce projet consiste au déploiement d'une architecture micro-services sur un cluster Kubernetes. Il met en œuvre :
1.  **Une application Web (Node.js)** : Un compteur de visites simple.
2.  **Une base de données (PostgreSQL)** : Pour stocker le nombre de visites de manière persistante.

L'objectif est de démontrer l'utilisation des objets Kubernetes : **Deployments, Services, Secrets, PersistentVolumeClaims (PVC) et ConfigMaps**.

---

## 🏗 Architecture Technique

L'infrastructure est composée des éléments suivants :

*   **Base de données (PostgreSQL)** :
    *   Déployée via un *Deployment*.
    *   Les données sont stockées sur un volume persistant (**PVC**) pour survivre au redémarrage des Pods.
    *   Exposée en interne via un service **ClusterIP** (`postgres-service`).
    *   *Note :* La structure de la table est gérée automatiquement par l'application au démarrage (approche "Code First").

*   **Application Web (Node.js)** :
    *   Déployée via un *Deployment*.
    *   Connectée à la base de données via des variables d'environnement.
    *   Exposée à l'extérieur du cluster via un service **NodePort** (`webapp-service`).

*   **Sécurité et Configuration** :
    *   **Secrets** : Stockage sécurisé des identifiants (utilisateur, mot de passe).
    *   **ConfigMap** : Stockage des configurations non sensibles (nom de la base, hôte, port).

---

## 📂 Structure du Projet

```text
.
├── app/                        # Code source de l'application
│   ├── app.js                  # Logique du serveur (Express + PG)
│   ├── Dockerfile              # Instructions de construction de l'image
│   └── package.json            # Dépendances Node.js
├── database/
│   └── init.sql                # Script SQL (référence)
├── k8s/                        # Fichiers de configuration Kubernetes
│   ├── app-deployment.yaml     # Déploiement de l'app Web
│   ├── app-service.yaml        # Service NodePort (Accès externe)
│   ├── configmap.yaml          # Configuration (Hôte, Port, Nom DB)
│   ├── database-deployment.yaml# Déploiement Postgres + PVC
│   ├── database-service.yaml   # Service ClusterIP (Réseau interne)
│   └── secret.yaml             # Identifiants encodés en Base64
└── README.md                   # Documentation du projet
```

---

## ⚙️ Paramètres de Configuration

L'application est configurée via des variables d'environnement injectées dans les conteneurs par Kubernetes.

| Variable | Description | Source | Valeur par défaut |
| :--- | :--- | :--- | :--- |
| `DB_HOST` | Nom d'hôte du service BDD | **ConfigMap** | `postgres-service` |
| `DB_PORT` | Port d'écoute Postgres | **ConfigMap** | `5432` |
| `DB_NAME` | Nom de la base de données | **ConfigMap** | `mydb` |
| `DB_USER` | Utilisateur BDD | **Secret** | `myuser` |
| `DB_PASSWORD` | Mot de passe BDD | **Secret** | `mypassword` |

---

## 🚀 Guide d'Installation et de Déploiement

### Prérequis
*   Docker installé et lancé.
*   Kubernetes (Minikube ou Docker Desktop activé).
*   La commande `kubectl`.

### Étape 1 : Construction de l'image Docker
Nous devons construire l'image de l'application web pour qu'elle soit disponible localement pour Kubernetes.

```bash
# Se placer dans le dossier app
cd app

# Construire l'image (le tag v3 est important car utilisé dans le déploiement)
docker build -t mon-app-web:v3 .

# Revenir à la racine du projet
cd ..
```

### Étape 2 : Déploiement des configurations et secrets
Nous commençons par créer les objets qui contiennent les données sensibles et la configuration générale.

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
```

### Étape 3 : Déploiement de la Base de Données
On lance le volume persistant, le déploiement Postgres et son service réseau interne.

```bash
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/database-service.yaml
```
*Astuce : Attendez quelques secondes que le pod postgres soit en statut `Running` avec la commande `kubectl get pods`.*

### Étape 4 : Déploiement de l'Application Web
On lance l'application Node.js et on l'expose vers l'extérieur.

```bash
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
```

---

## ✅ Validation et Tests

### 1. Accéder à l'application
Pour visualiser l'application dans votre navigateur :

*   **Si vous utilisez Minikube :**
    ```bash
    minikube service webapp-service
    ```
*   **Si vous utilisez Docker Desktop (localhost) :**
    Ouvrez votre navigateur sur `http://localhost:30000` (ou vérifiez le port mappé avec `kubectl get svc webapp-service`).

Vous devriez voir le message : **"🎉 GIGI T'AS RÉUSSI 🤏🏽 !"** accompagné du compteur de visites.

### 2. Test de la persistance des données
Pour prouver que la base de données conserve les informations même en cas de crash du Pod :

1.  Notez le nombre de visites actuel affiché sur la page.
2.  Supprimez le pod de la base de données (simulation d'une panne) :
    ```bash
    kubectl delete pod -l app=postgres
    ```
3.  Attendez que Kubernetes redémarre automatiquement le pod (vérifiez avec `kubectl get pods`).
4.  Rafraîchissez la page web : **Le compteur doit continuer là où il s'était arrêté**, prouvant que le volume persistant (PVC) fonctionne.

---

## 🧹 Nettoyage

Pour supprimer toutes les ressources créées par le projet :

```bash
kubectl delete -f k8s/
```
