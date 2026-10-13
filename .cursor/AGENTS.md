# FireWatch 69 — agent doc index

Planning detail lives in `docs/`. Cursor rules in `.cursor/rules/` summarize boundaries; use this index when a task needs the full spec.

| Task | Read first |
|------|------------|
| Project overview, stack, conventions | `docs/README.txt`, `docs/development_notes.txt`, `docs/tech_stack.txt` |
| Feature scope | `docs/features.txt` |
| Build order / MVP | `docs/phases.txt` |
| Incident states and transitions | `docs/lifecycle.txt` |
| Entity relationships and geo | `docs/entity_relationships.txt` |
| Roles and capabilities | `docs/permissions_matrix.txt`, `docs/document_acl.txt` |
| Web/mobile routes and API groups | `docs/routes_ui.txt` |
| Mongoose entity fields | `docs/model/<entity>.txt` |
| Notifications / email | `docs/email_events.txt` |
| Environment and secrets checklist | `docs/env_checklist.txt` |
| Seed / demo data | `docs/seed_plan.txt` |

**Note:** Docs are proposals until validated with barangay/BFP stakeholders. Prefer the codebase over docs when they disagree.
