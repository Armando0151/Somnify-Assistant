# Somnify Assistant

## Introduction

Le projet **Somnify Assistant** est une application web interactive conçue pour aider les utilisateurs à améliorer la qualité de leur sommeil grâce à un chatbot intelligent. Ce chatbot, nommé **Somnify**, agit comme un coach virtuel, offrant des conseils personnalisés pour des nuits réparatrices et des journées pleines d'énergie. Ce document présente les détails techniques du projet, les technologies utilisées, et les fonctionnalités principales.

## Objectif du Projet

L'objectif principal de **Somnify Assistant** est de fournir une interface conviviale permettant aux utilisateurs de poser des questions et de recevoir des conseils personnalisés sur le sommeil. Le chatbot utilise une API d'intelligence artificielle pour générer des réponses pertinentes et contextualisées, aidant ainsi les utilisateurs à mieux comprendre et améliorer leurs habitudes de sommeil.

## Technologies Utilisées

### Frontend
- **HTML** : Structure de base de l'interface utilisateur.
- **CSS** : Stylisation et mise en page responsive.
- **JavaScript** : Gestion des interactions utilisateur et communication asynchrone avec l'API.

### API IA
- **Google Gemini** : Intégration d'une API d'intelligence artificielle pour générer des réponses intelligentes et contextualisées.

## Architecture Technique

### Frontend
- **HTML** : Structure des pages web.
- **CSS** : Design et mise en page responsive.
- **JavaScript** : Gestion des interactions utilisateur et des requêtes asynchrones.

### API IA
- **Google Gemini** : Intégration de l'API pour traiter les requêtes et générer des réponses.

## Fonctionnalités Principales

1. **Interface Utilisateur Intuitive** : Une interface simple et conviviale permet aux utilisateurs de poser des questions et de recevoir des réponses en temps réel.
2. **Réponses Contextuelles** : Le chatbot utilise l'API Google Gemini pour fournir des réponses pertinentes et adaptées aux questions des utilisateurs.
3. **Indicateur de Pensée** : Un indicateur visuel montre que le chatbot est en train de générer une réponse, améliorant ainsi l'expérience utilisateur.
4. **Gestion des Erreurs** : Le chatbot est capable de gérer les erreurs et d'afficher des messages d'erreur clairs en cas de problème.

## Défis Rencontrés

1. **Intégration de l'API** : L'intégration de l'API Google Gemini a nécessité une compréhension approfondie de la documentation technique et des étapes d'intégration.
2. **Gestion des Interactions Utilisateur** : La gestion des interactions utilisateur via JavaScript a posé des défis en termes de synchronisation et de gestion des erreurs.
3. **Optimisation des Performances** : L'optimisation des performances pour garantir une expérience utilisateur fluide, notamment en ce qui concerne les temps de réponse de l'API, a été un défi important.

## Solutions Mises en Œuvre

1. **Intégration de l'API** : Après une étude approfondie de la documentation technique, l'API a été correctement intégrée dans le code JavaScript pour permettre une communication efficace.
2. **Gestion des Interactions Utilisateur** : Des fonctions JavaScript ont été développées pour gérer les interactions utilisateur de manière asynchrone, en utilisant des requêtes AJAX pour communiquer avec l'API sans recharger la page.
3. **Optimisation des Performances** : Des techniques d'optimisation, telles que la mise en cache des réponses de l'API et la réduction des requêtes inutiles, ont été mises en œuvre pour améliorer les performances globales de l'application.

## Conclusion

Le projet **Somnify Assistant** a permis de développer une application web interactive et intelligente, capable d'aider les utilisateurs à améliorer la qualité de leur sommeil. Malgré les défis techniques rencontrés, les solutions mises en œuvre ont permis de créer une expérience utilisateur fluide et efficace. Ce projet a également été une excellente opportunité pour approfondir les compétences en développement web et en intégration d'API d'intelligence artificielle.