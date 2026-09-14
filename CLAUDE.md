@shared/CLAUDE.md

# Arcads-specific session rules

- **API:** Arcads external API (`https://external-api.arcads.ai`).
- **Auth:** HTTP Basic via `ARCADS_BASIC_AUTH` or `ARCADS_API_KEY`. Setup check: `./scripts/check-arcads-env.sh`.
- **Skill:** `.claude/skills/arcads-external-api/SKILL.md` for API calls, prompts, and polling.
- **YouTube thumbnails:** `.claude/skills/generate-youtube-thumbnail/SKILL.md` (uses the Nano Banana 2 image endpoint via Arcads).
- **Image-ad ecosystem (Meta image creatives):** read `shared/skills/image-ad-prompting/OVERVIEW.md` FIRST. Three skills (`chatgpt-image-ad`, `nano-banana-image-ad`, `image-ad-clone`) + a shared 37-template prompt library. The `image-ad-clone` skill asks which backend to validate against at Phase 1, so generic "clone this ad" prompts route correctly. Output is image files; Meta upload is the separate `meta-ad-builder` skill.
- **Video post-production (local, no API):** `skills/editor-pro-max/SKILL.md` — vendored Remotion project in `tools/editor-pro-max/` for cutting, captioning, assembling and rendering video. Use it to post-produce Arcads output (stitch clips, burn captions, add CTA/watermark) before `meta-ad-builder`. It does NOT generate footage — that stays with `arcads-external-api`. Eight third-party reference skills ship inside `tools/editor-pro-max/.agents/skills/`; read them as files on demand, they are intentionally not registered as top-level skills.
- **Cost disclosure:** Always present credit totals as **estimates** — Arcads has no billing endpoint. Tell the user to confirm exact pricing in the Arcads platform.
- **Logging:** Log every generation call to `logs/arcads-api.jsonl`.
- **First-time setup:** If `.env` is missing, run `./scripts/setup.sh`. If `MASTER_CONTEXT.md` is missing, copy `MASTER_CONTEXT.template.md` to `MASTER_CONTEXT.md`.
