# Working branches

- Codex / ChatGPT works on `chatgpt`; Claude works on `claude-game`.
- Check the current branch before changing or pushing code. Use separate
  checkouts or Git worktrees when both tools work locally at the same time.
- `main` is the shared release branch. Merge work into it when the user asks.
- Edit the source in `src/`, then run `python build.py`. Do not edit generated
  HTML to implement game changes.
- Every push to `main`, `chatgpt`, or `claude-game` automatically rebuilds and
  publishes all three versions. Keep `.github/workflows/pages.yml` on all
  three branches so pushes continue to trigger deployment.
- Preserve branch-specific browser save keys and backwards compatibility for
  the existing main save. Keep all other ground rules in README.md.
