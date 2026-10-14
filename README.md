# domsli.github.io

Personal site, built with Vite and React. The page opens on About Me. Projects and Contact are the other tabs.

## Develop

Requires Node.js.

```bash
npm install
npm run dev
```

`npm run dev` starts Vite at http://localhost:5173/ and reloads when you change source files.

## Build

```bash
npm run build
```

This writes the compiled site to `dist/`. To serve that folder locally:

```bash
npm run preview
```

Images in `public/` are copied through as-is. CSS, JavaScript, and the page HTML are bundled.

## GitHub Pages

This repo is a user site at https://domsli.github.io/. Pushing to `master` runs a GitHub Action that builds the site and deploys `dist/`.

One-time setup in the GitHub repo:

1. Open **Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**

After that, each push to `master` updates the live site. You can also run the **Deploy to GitHub Pages** workflow manually from the Actions tab.
