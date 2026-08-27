// Gallery config. Contributions go to the repo serving the page, so a fork's
// deployment sends them to that fork.

// Pages serves a project site at https://<owner>.github.io/<repo>/. Null
// elsewhere, where the fallbacks below apply.
function servingRepo() {
  if (typeof location === "undefined") return null;
  const host = location.hostname.match(/^(.+)\.github\.io$/);
  if (!host) return null;
  const owner = host[1];
  const first = location.pathname.split("/").filter(Boolean)[0];
  return { owner, repo: first || `${owner}.github.io` };
}

// The repo this copy was built from, read from the git remote by vite.
function builtFromRepo() {
  return typeof ORIGIN_REPO === "undefined" ? null : ORIGIN_REPO;
}

const DEFAULTS = {
  owner: "UNC-Project-Open-AAC",
  repo: "OS-DPI",
};

export const GALLERY = {
  ...DEFAULTS,
  ...(builtFromRepo() || {}),
  ...(servingRepo() || {}),
  // Not in the URL: Pages may serve a different branch than holds the sources.
  branch: "main",
  // Repo path where contributed boards live (used in PR upload links).
  repoDir: "src/public/gallery",
  // Served path under BASE_URL.
  publicPath: "gallery",
};

export function galleryIndexURL() {
  return `${import.meta.env.BASE_URL}${GALLERY.publicPath}/index.json`;
}

// URL that loads a board into OS-DPI. A gallery folder normally ships its own
// board.osdpi. When meta.json sets `board`, that path is used instead, which
// lets an entry reuse a board the site already serves (examples/) rather than
// committing a second copy of the same file.
export function loadURL(item, edit = false) {
  const board = item.board || `${GALLERY.publicPath}/${item.slug}/board.osdpi`;
  return `${import.meta.env.BASE_URL}?fetch=${board}${edit ? "&edit" : ""}#${item.slug}`;
}

// GitHub "upload files" page for a slug's folder. Without write access GitHub
// forks and opens a PR; with it, the default is a direct commit, so quick_pull
// asks for the PR option. It is only a hint, so the dialog says so too.
export function uploadURL(slug) {
  const { owner, repo, branch, repoDir } = GALLERY;
  return `https://github.com/${owner}/${repo}/upload/${branch}/${repoDir}/${slug}?quick_pull=1`;
}

export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
