# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Local development

Configure these variables in the frontend `.env` file:

```text
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5251/api
```

Run the API from `Docuvault.Api` with its `http` launch profile, then start the
frontend with `npm run dev`. The frontend uses Supabase Auth for signup and
login, then sends the Supabase access token to the API to create or sync the
user's Docuvault profile. If email confirmation is enabled in Supabase, verify
the address before signing in; profile synchronization happens at first login.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
