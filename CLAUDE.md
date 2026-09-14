@shared/CLAUDE.md

# Règles de session — actives

- **Montage vidéo (local, sans API) :** `skills/editor-pro-max/SKILL.md` — projet Remotion vendorisé dans `tools/editor-pro-max/` pour couper, sous-titrer, assembler et rendre de la vidéo. Aucune clé API, aucun crédit. Ne génère pas d'images ni de rushes IA.
- **Publication Meta :** `shared/skills/meta-ad-builder/SKILL.md` — envoie un créa fini vers l'API Meta Marketing. Toute pub est créée en PAUSE. Auth via les clés `META_*` du `.env`.
- **Premier lancement :** si `MASTER_CONTEXT.md` est absent, copier `MASTER_CONTEXT.template.md` vers `MASTER_CONTEXT.md`.
- **Activer / désactiver un skill :** éditer `.skills-disabled` (un nom par ligne) puis lancer `./scripts/sync-skill.sh`. Les sources sous `skills/` et `shared/skills/` ne sont jamais supprimées.

# Arcads — DÉSACTIVÉ le 2026-09-14

Les 5 skills Arcads (`arcads-external-api`, `chatgpt-image-ad`, `generate-youtube-thumbnail`,
`image-ad-clone`, `nano-banana-image-ad`) sont listés dans `.skills-disabled` : leurs fichiers
sont intacts sous `skills/` et `shared/skills/`, mais ils ne sont plus copiés vers
`.claude/skills/` ni `.cursor/skills/`, donc Claude Code ne les charge plus.

**Ne pas appliquer les règles ci-dessous tant que les skills ne sont pas réactivés.**
Pour réactiver : retirer ou commenter les lignes concernées dans `.skills-disabled`, puis
lancer `./scripts/sync-skill.sh`.

<details>
<summary>Règles Arcads conservées pour réactivation</summary>

- **API :** Arcads external API (`https://external-api.arcads.ai`).
- **Auth :** HTTP Basic via `ARCADS_BASIC_AUTH` ou `ARCADS_API_KEY`. Vérification : `./scripts/check-arcads-env.sh`.
- **Skill :** `.claude/skills/arcads-external-api/SKILL.md` pour les appels API, les prompts et le polling.
- **Miniatures YouTube :** `.claude/skills/generate-youtube-thumbnail/SKILL.md` (endpoint image Nano Banana 2 via Arcads).
- **Écosystème image-ad (créas image Meta) :** lire `shared/skills/image-ad-prompting/OVERVIEW.md` EN PREMIER. Trois skills (`chatgpt-image-ad`, `nano-banana-image-ad`, `image-ad-clone`) + une bibliothèque partagée de 37 templates. Le skill `image-ad-clone` demande à la phase 1 quel backend valider, pour que les demandes génériques « clone cette pub » soient routées correctement. La sortie est un fichier image ; l'upload Meta relève du skill séparé `meta-ad-builder`.
- **Communication des coûts :** toujours présenter les totaux en crédits comme des **estimations** — Arcads n'a pas d'endpoint de facturation. Demander à l'utilisateur de confirmer le tarif exact dans la plateforme Arcads.
- **Journalisation :** consigner chaque appel de génération dans `logs/arcads-api.jsonl`.
- **Premier lancement :** si `.env` est absent, lancer `./scripts/setup.sh`.

</details>

> `shared/CLAUDE.md` (importé ci-dessus) décrit encore l'écosystème image-ad comme actif :
> il est propagé depuis gen-ai-core et n'a volontairement pas été modifié. Ses consignes
> Arcads sont à ignorer tant que la section ci-dessus reste désactivée.
