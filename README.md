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
    *   Initialisation : La structure de la table est gérée automatiquement par l'application au démarrage.

*   **Application Web (Node.js)** :
    *   Déployée via un *Deployment*.
    *   Connectée à la base de données via des variables d'environnement.
    *   Exposée à l'extérieur du cluster via un service **NodePort** (`webapp-service`).

*   **Sécurité et Configuration** :
    *   **Secrets** : Stockage sécurisé des identifiants (utilisateur, mot de passe).
    *   **ConfigMap** : Stockage des configurations non sensibles (nom de la base, hôte, port).

---

## 📂 Structure du Projet

.
├── app/                        # Code source de l'application
│   ├── app.js                  # Logique du serveur (Express + PG)
│   ├── Dockerfile              # Instructions de construction de l'image
│   └── package.json            # Dépendances Node.js
├── database/
│   └── init.sql                # Script SQL de référence (géré par l'app)
├── k8s/                        # Fichiers de configuration Kubernetes
│   ├── app-deployment.yaml     # Déploiement de l'app Web
│   ├── app-service.yaml        # Service NodePort (Accès externe)
│   ├── configmap.yaml          # Configuration (Hôte, Port, Nom DB)
│   ├── database-deployment.yaml# Déploiement Postgres + PVC
│   ├── database-service.yaml   # Service ClusterIP (Réseau interne)
│   └── secret.yaml             # Identifiants encodés en Base64
└── README.md                   # Documentation du projet
⚙️ Paramètres de Configuration
L'application est configurée via des variables d'environnement injectées dans les conteneurs.
Variable	Description	Source	Valeur par défaut
DB_HOST	Nom d'hôte du service BDD	ConfigMap	postgres-service
DB_PORT	Port d'écoute Postgres	ConfigMap	5432
DB_NAME	Nom de la base de données	ConfigMap	mydb
DB_USER	Utilisateur BDD	Secret	myuser
DB_PASSWORD	Mot de passe BDD	Secret	mypassword
🚀 Guide d'Installation et de Déploiement
Prérequis
Docker installé et lancé.
Kubernetes (Minikube ou Docker Desktop activé).
La commande kubectl.
Étape 1 : Construction de l'image Docker
Puisque nous travaillons en local, nous devons construire l'image de l'application web manuellement pour qu'elle soit disponible pour Kubernetes.
code
Bash
# Se placer à la racine du projet
cd app

# Construire l'image avec le tag v3 (correspondant au deployment.yaml)
docker build -t mon-app-web:v3 .

# Revenir à la racine
cd ..
Étape 2 : Déploiement des configurations et secrets
Nous commençons par créer les objets qui contiennent les données sensibles et la configuration.
code
Bash
kubectl apply -f k8s/secret.yaml
# Si vous utilisez un ConfigMap :
kubectl apply -f k8s/configmap.yaml
Étape 3 : Déploiement de la Base de Données
On lance le volume persistant, le déploiement Postgres et son service réseau.
code
Bash
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/database-service.yaml
Vérification : Attendez que le pod postgres soit en statut Running.
Étape 4 : Déploiement de l'Application Web
On lance l'application Node.js et on l'expose.
code
Bash
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
✅ Validation et Tests
1. Accéder à l'application
Pour obtenir l'URL d'accès dans le navigateur :
Si vous utilisez Minikube :
code
Bash
minikube service webapp-service
Si vous utilisez Docker Desktop (localhost) :
Ouvrez votre navigateur sur http://localhost:30000 (ou le port assigné par NodePort, vérifiable via kubectl get svc webapp-service).
Vous devriez voir le message : "🎉 GIGI T'AS RÉUSSI 🤏🏽 !" et le compteur de visites.
2. Test de la persistance des données
Pour prouver que la base de données conserve les infos même si elle crash :
Relevez le nombre de visites actuel.
Supprimez le pod de la base de données (Kubernetes va le redémarrer automatiquement) :
code
Bash
kubectl delete pod -l app=postgres
Attendez que le nouveau pod soit Running.
Rafraîchissez la page Web : Le compteur ne doit pas être retombé à 0.
🧹 Nettoyage
Pour supprimer toutes les ressources créées par le projet :
code
Bash
kubectl delete -f k8s/
code
Code
### Petit conseil pour le rendu
J'ai ajouté une section **"Structure du Projet"** qui mentionne le fichier `configmap.yaml`.

Si tu décides de **ne pas** utiliser le ConfigMap (et de garder tout dans les secrets comme tu avais fait au début), supprime simplement :
1. La ligne `├── configmap.yaml` dans l'arborescence.
2. La commande `kubectl apply -f k8s/configmap.yaml` dans l'étape 2.
3. Change "ConfigMap" par "Secret" dans le tableau des paramètres.
User
je ne dois mettre que ça dans mon readme ?:
Projet Kubernetes - Application Web + Base de Données
👥 Auteurs
Damien LÉON
Gianna QUENUM
Michael YAGHI
Nikos THOUMYRE
📝 Description du Projet
Ce projet consiste au déploiement d'une architecture micro-services sur un cluster Kubernetes. Il met en œuvre :
Une application Web (Node.js) : Un compteur de visites simple.
Une base de données (PostgreSQL) : Pour stocker le nombre de visites de manière persistante.
L'objectif est de démontrer l'utilisation des objets Kubernetes : Deployments, Services, Secrets, PersistentVolumeClaims (PVC) et ConfigMaps.
🏗 Architecture Technique
L'infrastructure est composée des éléments suivants :
Base de données (PostgreSQL) :
Déployée via un Deployment.
Les données sont stockées sur un volume persistant (PVC) pour survivre au redémarrage des Pods.
Exposée en interne via un service ClusterIP (postgres-service).
Initialisation : La structure de la table est gérée automatiquement par l'application au démarrage.
Application Web (Node.js) :
Déployée via un Deployment.
Connectée à la base de données via des variables d'environnement.
Exposée à l'extérieur du cluster via un service NodePort (webapp-service).
Sécurité et Configuration :
Secrets : Stockage sécurisé des identifiants (utilisateur, mot de passe).
ConfigMap : Stockage des configurations non sensibles (nom de la base, hôte, port).
📂 Structure du Projet
code
Text
.
├── app/                        # Code source de l'application
│   ├── app.js                  # Logique du serveur (Express + PG)
│   ├── Dockerfile              # Instructions de construction de l'image
│   └── package.json            # Dépendances Node.js
├── database/
│   └── init.sql                # Script SQL de référence (géré par l'app)
├── k8s/                        # Fichiers de configuration Kubernetes
│   ├── app-deployment.yaml     # Déploiement de l'app Web
│   ├── app-service.yaml        # Service NodePort (Accès externe)
│   ├── configmap.yaml          # Configuration (Hôte, Port, Nom DB)
│   ├── database-deployment.yaml# Déploiement Postgres + PVC
│   ├── database-service.yaml   # Service ClusterIP (Réseau interne)
│   └── secret.yaml             # Identifiants encodés en Base64
└── README.md                   # Documentation du projet
