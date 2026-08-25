# La Parole — Loge n° 5385 (GODF), Orient de Yaoundé

Site vitrine de la Respectable Loge La Parole. Site statique, sans dépendance ni
étape de compilation : HTML, CSS et JavaScript natifs.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil (hero, présentation, chiffres, FAQ, contact) |
| `actualites.html` | Liste des publications, avec filtres par catégorie |
| `presentation.html` | Mot de bienvenue |
| `convent-2026.html` | Page événement |
| `styles.css` | Feuille de style unique, thèmes sombre et clair par variables CSS |
| `script.js` | Interactions : thème, menu, parallaxe, FAQ, slider, formulaire, filtres |
| `assets/` | Images (WebP) et icônes |

## Consulter le site en local

Aucune installation n'est nécessaire. Depuis le dossier du projet :

```bash
python -m http.server 8080
```

Puis ouvrir http://localhost:8080

> Ouvrir `index.html` directement par double-clic fonctionne aussi, mais un
> serveur local reflète plus fidèlement le comportement en production.

## Configurer le formulaire de contact

Par défaut, le formulaire bascule sur la messagerie du visiteur (`mailto:`).
Pour activer l'envoi automatique des messages :

1. Créer un compte sur [formspree.io](https://formspree.io) — l'offre gratuite suffit.
2. Créer un formulaire et y indiquer l'adresse de réception de la Loge.
3. Copier l'identifiant qui apparaît dans l'URL du formulaire
   (`https://formspree.io/f/xdorwqkv` → `xdorwqkv`).
4. Le reporter en haut de `script.js` :

```js
const FORMSPREE_FORM_ID = 'xdorwqkv';
```

Si l'envoi échoue malgré tout, le visiteur se voit proposer un lien de repli
vers `laparolegodf@gmail.com` : le formulaire ne reste jamais sans issue.

## Adresse du site

L'adresse publique est inscrite en dur dans les balises `canonical`, Open Graph,
`robots.txt` et `sitemap.xml`. Elle pointe actuellement vers
`https://leolinfondjo.github.io/LA-PAROLE/`.

**En cas de nom de domaine propre**, remplacer cette adresse dans :
`index.html`, `actualites.html`, `presentation.html`, `convent-2026.html`,
`robots.txt` et `sitemap.xml`.

## Images

Les visuels sont servis en WebP. Les PNG d'origine sont conservés dans `assets/`
comme fichiers sources. Pour régénérer les WebP après modification d'un PNG :

```bash
python -c "from PIL import Image; im=Image.open('assets/mon-image.png'); im.save('assets/mon-image.webp','WEBP',quality=80,method=6)"
```

## Points d'attention pour les évolutions

- **La barre de navigation et le pied de page sont dupliqués dans les 4 pages.**
  Toute modification du menu doit être répercutée dans chaque fichier, en version
  bureau *et* mobile.
- **Les articles sont saisis à deux endroits** : le slider de `index.html` et la
  grille de `actualites.html`.
- Le contenu n'est masqué à l'ouverture (animation d'apparition) que si la classe
  `js` est présente sur `<html>`. Sans JavaScript, tout reste visible.
