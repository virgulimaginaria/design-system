# Repository settings (one-time setup)

Settings that cannot be expressed as files in the repository. Apply them once, as a repository (or organisation) administrator.

## Repository

_Settings → General_

- Visibility: **Public**
- Default branch: **`main`**
- Licence: **MIT** (detected from `LICENSE`)
- Pull requests: **Allow squash merging** enabled (merge commits and rebase merging may be disabled)
- **Automatically delete head branches** enabled

## Ruleset for `main`

_Settings → Rules → Rulesets → New branch ruleset_ targeting the default branch:

- Restrict deletions and block force pushes.
- **Require a pull request before merging** (required approvals: 0, unless reviews are mandated organisation-wide).
- **Require status checks to pass**, with these checks from the CI workflow (they appear after the first run):
  - `Format, lint & typecheck`
  - `Unit, story & accessibility tests`
  - `Build packages & Storybook`

## GitHub Pages

_Settings → Pages → Build and deployment → Source → **GitHub Actions**_

The `storybook-pages.yml` workflow then deploys Storybook on every push to `main` (it can also be run manually). The site is served at `https://<owner>.github.io/design-system/`, currently **https://virgulimaginaria.github.io/design-system/**. The `github-pages` environment is created automatically on the first deployment.

## GitHub Actions permissions

_Settings → Actions → General → Workflow permissions_

- **Allow GitHub Actions to create and approve pull requests**: required for the Changesets "Version Packages" pull request. If this option is greyed out, it must first be allowed at organisation level (_Organisation settings → Actions → General_).
- The default token permission can stay **read-only**: each workflow requests what it needs (`pages: write` + `id-token: write` for Pages; `contents: write`, `pull-requests: write`, `packages: write` for releases).

## GitHub Packages

- Packages are published under the **`@virgulimaginaria`** scope. GitHub Packages requires the npm scope to match the **account that owns the repository** (`virgulimaginaria`). If the repository ever moves to another owner, the scope, the `repository` URLs in `packages/*/package.json` and the Pages URL in the docs must change with it (a breaking change for consumers).
- After the first publish, each package inherits the repository's visibility. Check _Package settings → Manage Actions access_ so this repository's workflows keep write access.
- Consuming applications in other repositories need read access: for GitHub Actions in another repository of the same organisation, grant it under _Package settings → Manage Actions access_; developers use a token with `read:packages` (see the README).

## Security

_Settings → Security_ (Advanced Security / Code security):

- **Private vulnerability reporting**: enable (referenced by `SECURITY.md`).
- **Dependabot alerts** and **security updates**: enable. Version updates are configured in `.github/dependabot.yml`.
- **Secret scanning** and **push protection**: enable (free for public repositories).
