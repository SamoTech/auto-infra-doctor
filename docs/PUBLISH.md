# Publishing to npm

This guide covers how to publish `auto-infra-doctor` to the npm registry for the first time and for subsequent releases.

---

## Prerequisites

1. **npm account** — create one at [npmjs.com](https://www.npmjs.com/) if you don’t have one
2. **npm CLI** — version ≥ 9 (`npm --version`)
3. **Node.js** — version ≥ 18
4. **Repository clean** — all changes committed and pushed

---

## First-Time Publish

### 1. Log in to npm

```bash
npm login
# Enter your npm username, password, and OTP
```

### 2. Verify package contents

Dry-run to see exactly what will be published:

```bash
npm pack --dry-run
```

Expected files in the tarball:

```
bin/cli.js
src/engine.js
src/validator.js
src/rules/mikrotik.js
src/rules/firewall.js
src/rules/nat.js
src/rules/routing.js
src/rules/vpn.js
src/ai/heuristics.js
src/ai/openai.js
examples/mikrotik-broken.rsc
examples/mikrotik-secure.rsc
README.md
LICENSE
package.json
```

If you see `dashboard/`, `vercel.json`, `.github/`, or `tests/` in the list, check `.npmignore`.

### 3. Publish

```bash
npm publish --access public
```

> The `--access public` flag is required for scoped packages. For an unscoped package like `auto-infra-doctor` it is optional but harmless.

### 4. Verify live

```bash
npm info auto-infra-doctor
npx auto-infra-doctor --version
```

---

## Release Workflow (Subsequent Versions)

```bash
# 1. Update CHANGELOG.md — move [Unreleased] items to a new version section

# 2. Bump the version (choose one)
npm version patch   # 1.2.0 → 1.2.1  (bug fix)
npm version minor   # 1.2.0 → 1.3.0  (new feature, backward-compatible)
npm version major   # 1.2.0 → 2.0.0  (breaking change)

# npm version automatically:
#   - Updates package.json
#   - Creates a git commit: "v1.2.1"
#   - Creates a git tag:    "v1.2.1"

# 3. Push commit and tag
git push && git push --tags

# 4. Publish to npm
npm publish

# 5. Create GitHub release
# Go to: https://github.com/SamoTech/auto-infra-doctor/releases/new
# Select the tag, paste the CHANGELOG section as release notes
```

---

## After Publishing

Once the package is live on npm, update `README.md` to restore the npm badges:

```markdown
[![npm version](https://img.shields.io/npm/v/auto-infra-doctor?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/auto-infra-doctor)
[![npm downloads](https://img.shields.io/npm/dm/auto-infra-doctor?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/auto-infra-doctor)
```

Add them back to the first badge row in the README, between the Live Demo badge and the License badge.

---

## Automating Releases with GitHub Actions

Optional: automate publishing on every GitHub Release:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` to your repository secrets at:
`Settings → Secrets and variables → Actions → New repository secret`
