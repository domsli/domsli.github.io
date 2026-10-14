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

GitHub Pages serves this repository from source, not from `dist/`. Publishing the compiled site means deploying the contents of `dist/`.
