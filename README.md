## Product Management App

A simple, production-lean Product Management web app built with Next.js App Router. It supports authentication, listing and searching products, viewing details, creating, editing, and deleting products, with category support.

### Features

- **Authentication**: Email-based auth that retrieves a JWT token from the API
- **Product listing**: Paginated list with search (`searchedText`), skeleton loading states
- **Product details**: Per-product details at `products/[slug]/details`
- **Create & edit**: Forms with validation for creating and updating products
- **Delete**: Confirmation modal before deletion
- **Categories**: Load and select categories from the API

### Tech Stack

- **Next.js 15** (App Router) + React 19
- **Redux Toolkit** for state management
- **React Hook Form** + **Zod** for forms and validation
- **Tailwind CSS v4** for styling

### External API

- Base URL: `https://api.bitechx.com`
- Endpoints used:
  - `POST /auth` (returns `{ token }`)
  - `GET /products` and `GET /products/search?searchedText=...` with `offset`, `limit`
  - `GET /products/:slug`
  - `POST /products`
  - `PUT /products/:id`
  - `DELETE /products/:id`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A package manager: npm, pnpm, or yarn (examples use pnpm)

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
# opens http://localhost:3000
```

### Build

```bash
pnpm build
```

### Start (after build)

```bash
pnpm start
```

### Lint

```bash
pnpm lint
```

Scripts come from `package.json` and use Next.js with Turbopack for `dev` and `build`.

---

## App Structure (key paths)

```
src/
  app/
    page.tsx                     # Landing / redirect
    login/page.tsx               # Login via email → token
    products/page.tsx            # Products list + search
    products/[slug]/details/     # Product details
    products/[slug]/edit/        # Edit product
    create/page.tsx              # Create product
    components/                  # UI components (cards, forms, modal, skeleton)
    lib/api.ts                   # API client & endpoints
    lib/redux/                   # Redux store & slices
    storeProvider.tsx            # Redux Provider for App Router
  types/product.ts               # Shared types
```

---

## Usage Guide

- **Login**: Navigate to `/login`, enter your email. On success, a JWT token is stored in Redux state (not persisted across reloads by default).
- **Products**: Go to `/products`. Use search to filter by text; list calls either `/products` or `/products/search`.
- **Create**: `/create` opens a validated form; on success, the product is created via `POST /products`.
- **Edit**: From details or card actions, go to `/products/[slug]/edit` to update via `PUT /products/:id`.
- **Delete**: Use the action menu on a product card; a confirmation modal appears before `DELETE /products/:id`.

### Auth Notes

- Auth flow: `POST /auth` with email → returns `{ token }` → token stored in Redux slice `auth`.
- Token is attached as `Authorization: Bearer <token>` for all protected endpoints.
- For persistence, add storage (e.g., localStorage) and rehydrate the token in the Redux slice or via a middleware.

---

## Configuration

- API base URL is hardcoded in `src/app/lib/api.ts` as `API_BASE_URL`. Change this to point to your backend if needed.
- Tailwind CSS is set up via `postcss.config.mjs` and the default `globals.css`.

---

## Deployment

- Build with `pnpm build` and serve with `pnpm start`.
- Compatible with platforms like Vercel. Ensure environment and API base URL align with your deployment.

---

## License

This project is provided as-is; adapt licensing as appropriate for your use case.
