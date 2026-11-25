#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  THANH VAN VIET — push the site to GitHub and refresh the live preview
#
#  Double-click me in Finder. I will:
#    1. commit your changes and push `main` to github.com/openflowfun/Thanh-Van-Viet
#    2. build the site for GitHub Pages (outside iCloud, so node_modules never syncs)
#    3. publish the build to `gh-pages` and open the preview
#
#  Preview: https://openflowfun.github.io/Thanh-Van-Viet/
# ─────────────────────────────────────────────────────────────────────────────

set -uo pipefail

REPO_URL="https://github.com/openflowfun/Thanh-Van-Viet.git"
PREVIEW_URL="https://openflowfun.github.io/Thanh-Van-Viet/"
BASE_PATH="/Thanh-Van-Viet"
BUILD_DIR="$HOME/Library/Caches/thanh-van-viet-build"

cd "$(dirname "$0")" || exit 1
PROJECT="$(pwd)"

red=$'\033[0;31m'; gold=$'\033[0;33m'; green=$'\033[0;32m'; dim=$'\033[2m'; bold=$'\033[1m'; off=$'\033[0m'
step() { printf "\n${red}◆${off} ${bold}%s${off}\n" "$1"; }
ok()   { printf "  ${green}✓${off} %s\n" "$1"; }
note() { printf "  ${dim}%s${off}\n" "$1"; }
finish() {
  printf "\n${dim}Press any key to close this window.${off}"
  read -r -n 1 -s
  echo
  exit "${1:-0}"
}
fail() { printf "\n  ${red}✗ %s${off}\n" "$1"; [ -n "${2:-}" ] && printf "  ${dim}%s${off}\n" "$2"; finish 1; }

clear
printf "${red}"
cat <<'ART'

      ╔══════════════════════════════════════════════╗
      ║           T H A N H   V A N   V I E T          ║
      ║      Vietnamese Fashion & Lifestyle · push     ║
      ╚══════════════════════════════════════════════╝
ART
printf "${off}"
note "$PROJECT"

# ── Preflight ───────────────────────────────────────────────────────────────
command -v git >/dev/null 2>&1 || fail "git isn't installed." "Run:  xcode-select --install   then double-click me again."
[ -d .git ] || fail "This folder isn't a git repository." "Expected the Thanh Van Viet project folder."

# iCloud may have offloaded some files ("Optimise Mac Storage"); reading them brings them back.
if command -v brctl >/dev/null 2>&1; then brctl download "$PROJECT" >/dev/null 2>&1 || true; fi

# Leftovers from a chat hand-off (zips already unpacked) — not part of the site.
rm -rf .claude-sync 2>/dev/null || true

# Use the user's normal GitHub sign-in first; fall back to the token file if present.
git_push() {
  if git push "$@" 2>/tmp/tvv-push.err; then return 0; fi
  if [ -f .git/claude-credentials ]; then
    note "Normal sign-in didn't work — trying the saved token…"
    git -c credential.helper= -c credential.helper="store --file=$PROJECT/.git/claude-credentials" push "$@" 2>/tmp/tvv-push.err && return 0
  fi
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    note "Trying your GitHub CLI sign-in…"
    gh auth setup-git >/dev/null 2>&1 && git push "$@" 2>/tmp/tvv-push.err && return 0
  fi
  cat /tmp/tvv-push.err
  return 1
}

# Commit identity fallback (only used if git has no name/email configured).
IDENT=()
git config user.email >/dev/null 2>&1 || IDENT=(-c user.name="OpenFlow" -c user.email="openflowfun@users.noreply.github.com")

# ── 1. Source → main ────────────────────────────────────────────────────────
step "1/3  Saving your changes to main"
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REPO_URL"
git checkout -q main 2>/dev/null || fail "Couldn't switch to the main branch." "Commit or stash anything unusual, then try again."
git fetch -q origin main gh-pages 2>/dev/null || note "Couldn't reach GitHub to fetch (offline?) — will try to push anyway."
git branch -q --set-upstream-to=origin/main main 2>/dev/null || true

git add -A -- . ':!Branding.JPEG' ':!Logo.JPEG' 2>/dev/null || git add -A
if git diff --cached --quiet; then
  ok "Nothing new to commit"
else
  if [ -s .push-message ]; then
    git ${IDENT[@]+"${IDENT[@]}"} commit -q -F .push-message && rm -f .push-message
  else
    git ${IDENT[@]+"${IDENT[@]}"} commit -q -m "Update site — $(date '+%d %b %Y, %H:%M')"
  fi
  ok "Committed: $(git log -1 --pretty=%s)"
fi

if git rev-parse -q --verify origin/main >/dev/null && ! git merge-base --is-ancestor origin/main HEAD; then
  note "GitHub has newer commits — rebasing on top of them…"
  git ${IDENT[@]+"${IDENT[@]}"} pull -q --rebase origin main || fail "Couldn't merge GitHub's latest changes automatically." "Open the folder in GitHub Desktop or VS Code to resolve, then run me again."
fi

git_push -u origin main || fail "Push to main was refused." "Sign in once with:  gh auth login   (or GitHub Desktop), then double-click me again."
ok "main is on GitHub"

# ── 2. Build ────────────────────────────────────────────────────────────────
step "2/3  Building the preview"
SITE_OUT=""
NODE_MAJOR=0
if command -v node >/dev/null 2>&1; then NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"; fi

if command -v npm >/dev/null 2>&1 && [ "$NODE_MAJOR" -ge 20 ]; then
  note "Node $(node -v) · building in $BUILD_DIR"
  mkdir -p "$BUILD_DIR"
  rsync -a --delete \
    --exclude '.git' --exclude 'node_modules' --exclude '.next' --exclude 'out' \
    --exclude 'website-html' --exclude '*.zip' --exclude '*.JPEG' --exclude '*.command' --exclude '.DS_Store' \
    "$PROJECT/" "$BUILD_DIR/src-copy/"
  cd "$BUILD_DIR/src-copy" || fail "Couldn't open the build folder."
  # Keep node_modules between runs; reinstall only when the lockfile changes.
  if [ ! -d node_modules ] || ! cmp -s package-lock.json "$BUILD_DIR/.lock-installed" 2>/dev/null; then
    note "Installing packages (first run takes a minute)…"
    npm ci --no-audit --no-fund --loglevel=error || fail "npm install failed." "Check your internet connection and try again."
    cp package-lock.json "$BUILD_DIR/.lock-installed"
  fi
  NEXT_PUBLIC_BASE_PATH="$BASE_PATH" NEXT_TELEMETRY_DISABLED=1 npm run -s build || fail "The build failed — see the messages above."
  SITE_OUT="$BUILD_DIR/src-copy/out"
  cd "$PROJECT" || exit 1
  ok "Built $(find "$SITE_OUT" -name '*.html' | wc -l | tr -d ' ') pages"
elif [ -f out/index.html ]; then
  note "Node 20+ isn't installed — publishing the ready-built out/ folder instead."
  note "(Install Node from nodejs.org to build fresh each time.)"
  SITE_OUT="$PROJECT/out"
  ok "Using the ready-built site"
else
  fail "Node 20+ isn't installed and there's no ready-built out/ folder." "Install Node from https://nodejs.org, then double-click me again."
fi
touch "$SITE_OUT/.nojekyll"

# ── 3. Publish → gh-pages ───────────────────────────────────────────────────
step "3/3  Publishing to GitHub Pages"
WT="$(mktemp -d "${TMPDIR:-/tmp}/tvv-pages.XXXXXX")"
git worktree prune 2>/dev/null || true
if git rev-parse -q --verify origin/gh-pages >/dev/null; then
  git worktree add -q -f -B gh-pages "$WT" origin/gh-pages || fail "Couldn't prepare the gh-pages branch."
else
  git worktree add -q -f --detach "$WT" && git -C "$WT" checkout -q --orphan gh-pages && git -C "$WT" rm -rq --cached . 2>/dev/null
fi
rsync -a --delete --exclude '.git' "$SITE_OUT/" "$WT/"
git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  ok "Preview already up to date"
else
  git -C "$WT" ${IDENT[@]+"${IDENT[@]}"} commit -q -m "Deploy preview — $(git log -1 --pretty=%h main) · $(date '+%d %b %Y, %H:%M')"
  git_push origin gh-pages || { git worktree remove --force "$WT" 2>/dev/null; fail "Push to gh-pages was refused."; }
  ok "gh-pages updated"
fi
git worktree remove --force "$WT" 2>/dev/null || true

printf "\n${gold}  ✦ Done.${off} The preview refreshes in about a minute:\n"
printf "    ${bold}%s${off}\n" "$PREVIEW_URL"
printf "    ${bold}%sebay/${off}  ← all 28 eBay listings\n" "$PREVIEW_URL"
sleep 2
open "${PREVIEW_URL}ebay/" >/dev/null 2>&1 || true
finish 0
