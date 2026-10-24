# Nutab

A static new-tab start page built with Nuxt. Deployed to GitHub Pages under `/nutab/`.

## Customizing

Everything is editable in the app itself — no config files, no rebuilds:

- **Edit** button (top right): add/rename/delete categories; add/edit/delete links; reorder links with the arrows or move them between categories with the dropdown; override a link's icon with any image URL (useful for internal hosts like `*.home.arpa`, which no public favicon service can resolve).
- **⚙ Settings**: search engine (Kagi, DuckDuckGo, Google or a custom `...{q}` URL), clock format, show/hide searchbar, accent color.
- Changes are saved to your browser's `localStorage` instantly. Use **Export** / **Import** in Settings to back up your setup or move it to another browser/machine. **Reset** restores the defaults bundled in `assets/config.json`.

Favicons for public sites are resolved at runtime via DuckDuckGo's icon service (`icons.duckduckgo.com`), so no build-time fetching step is needed. Internal/private hosts and missing icons fall back to `public/default_favicon.png`.

## Layout

The category cards form a cascading deck across the viewport: each card keeps its full width, later cards overlap earlier ones, and at rest every card's links peek out so you can see what is where. Moving the pointer into the deck opens a card fully in front while the rest dim back and hide their links, so the stacked cards read as labelled tabs. The deck tracks the pointer position rather than CSS hover, so sweeping the cursor left or right walks through the cards even though the open card covers the next one's strip; leaving the deck returns it to the resting state. The UI scales with the viewport (`1rem = min(100vw / 120, 100vh / 62)`), so the deck sits in exactly the same places on a 1080p and a 4K monitor. Edit mode switches to a wider two-column grid so the edit rows stay usable.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
