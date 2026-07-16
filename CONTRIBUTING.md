GUI-friendly contribution & deployment steps

If you prefer GUI tools for committing and pushing, follow one of these simple flows.

GitHub Desktop (recommended for beginners)
- Open GitHub Desktop and choose File → Add local repository → Select this project folder.
- In the Changes tab, type a commit message and click Commit to main.
- Click Publish repository (or Push origin) to push to the remote GitHub repo.

VS Code (Source Control)
- Open the project in VS Code.
- Click the Source Control icon in the Activity Bar.
- Stage files by clicking `+`, enter a commit message, then click the checkmark to commit.
- Click the ... menu → Push to push to the configured remote. Use the UI to add a remote if needed.

GitHub Web (quick single-file edits)
- Use the repo web UI to upload files or edit files inline, then create a PR or commit directly to `main`.

Setting secrets (GUI)
- GitHub: repo → Settings → Secrets and variables → Actions → New repository secret. Add `OPENAI_API_KEY`.
- Vercel: Project → Settings → Environment Variables → Add `OPENAI_API_KEY` (select Environment: Production/Preview/Development as appropriate).

Deploy to Vercel (button)
- If you connect this repo to Vercel, deployments happen automatically on push to `main`.
- You can also use `vercel dev` for local testing.

Safety
- Never commit `.env.local` or any secret values. Use the provided `.env.local.example` as a template.
