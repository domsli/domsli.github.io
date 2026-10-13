# domsli.github.io

Personal site, built with Vite and React. The page shell is `src/App.jsx`. The terminal still runs from the scripts in `assets/js`, started after the app mounts.

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

Images and HTML partials in `public/` are copied through as-is. CSS and JavaScript are bundled.

GitHub Pages serves this repository from source, not from `dist/`. Publishing the compiled site means deploying the contents of `dist/`.
