# ☸️ Projet Kubernetes : Application Web & PostgreSQL

Bienvenue sur le dépôt de notre projet d'orchestration de conteneurs.
Ce projet déploie une architecture micro-services résiliente composée d'une interface web (Node.js) et d'une base de données persistante (PostgreSQL).

## 👥 Auteurs
*   **Damien LÉON**
*   **Gianna QUENUM**
*   **Michael YAGHI**
*   **Nikos THOUMYRE**

---

## 🚀 Fonctionnalités Clés

Ce projet démontre l'utilisation avancée des objets Kubernetes :

*   **Architecture Micro-services :** Séparation stricte Front-end / Back-end.
*   **Haute Disponibilité :** Utilisation de `Deployments` pour l'auto-réparation (Self-healing).
*   **Sécurité Réseau :** Isolation de la base de données via `ClusterIP` et exposition Web via `NodePort`.
*   **Gestion des Secrets :** Séparation configuration/code via `ConfigMaps` et `Secrets` (Base64).
*   **Persistance :** Stockage durable des données via `PersistentVolumeClaim` (PVC).

---

## 📂 Organisation du Projet

*   **`app/`** : Code source de l'application Node.js et Dockerfile.
*   **`k8s/`** : Fichiers manifestes YAML pour le déploiement Kubernetes.
*   **`database/`** : Scripts SQL d'initialisation.
