// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const base = "/OS-DPI/";

// Repo this checkout came from, as deploy.sh reads it. The gallery uses it to
// route contributions when the page URL cannot say.
function originRepo() {
  try {
    const url = execSync("git config --get remote.origin.url", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
    return m ? { owner: m[1], repo: m[2] } : null;
  } catch {
    return null;
  }
}

const dt = new Date();
const version = `"${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}-${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}"`;

const fullReloadAlways = {
  name: "full-reload-always",
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
};

// The deployed site has the repo's examples/ folder copied next to the app (see
// deploy.sh), so `?fetch=examples/...` resolves in production. examples/ sits
// above the Vite root, so the dev server would otherwise fall through to the
// index.html catch-all and hand back HTML instead of the board. Serve it here so
// the gallery entries and the README demo links behave the same way locally.
const examplesRoot = path.resolve("../examples");
const serveExamples = {
  name: "serve-examples",
  configureServer(server) {
    const prefix = `${base}examples/`;
    server.middlewares.use((req, res, next) => {
      if (!req.url || !req.url.startsWith(prefix)) return next();
      const rel = decodeURIComponent(
        req.url.slice(prefix.length).split("?")[0],
      );
      const file = path.resolve(examplesRoot, rel);
      // Keep the resolved path inside examples/ so ../ cannot escape it.
      if (file !== examplesRoot && !file.startsWith(examplesRoot + path.sep)) {
        return next();
      }
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
      res.setHeader("Content-Type", "application/octet-stream");
      fs.createReadStream(file).pipe(res);
    });
  },
};

export default defineConfig({
  base,
  resolve: {
    alias: {
      components: path.resolve("./components"),
      app: path.resolve("."),
      css: path.resolve("./css"),
    },
  },
  optimizeDeps: {
    include: ["tracky-mouse"],
  },
  build: {
    sourcemap: true,
    minify: false,
    // oldest engine the CSS supports (:has(), dvh, dialog); esnext shipped
    // syntax that older iPad Safari couldn't parse
    target: "safari15.4",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: "./index.html",
        "service-worker": "./service-worker.js",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  define: {
    APP_VERSION: version,
    ORIGIN_REPO: JSON.stringify(originRepo()),
  },
  plugins: [fullReloadAlways, serveExamples],
});
