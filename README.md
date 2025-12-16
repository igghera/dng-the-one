# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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

## Convert images to WebP preserving their names (ImageMagick)

```bash
$ magick mogrify -format webp -quality 90 -define webp:lossless=false -define webp:alpha-quality=100 *
```

## Convert images to KTX2 preserving their names (basisu)

REF: https://claude.ai/chat/0719143b-9c17-4a50-94ca-9d9ccb1048ab

```bash
$ basisu -ktx2 *
```
