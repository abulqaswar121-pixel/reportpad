# NDH E-store readiness fix

## Goal
Restore the repository's expected development build command and confirm the current TanStack Start E-store remains ready for continued work.

## Steps
1. Add the missing `build:dev` package script using Vite's development build mode.
2. Preserve the existing file-based routes, shared shell, commerce features, backend integrations, and published URLs.
3. Verify the route declarations and build configuration after the script change.
4. Report readiness for the next NDH E-store feature request.

## Technical details
- Keep `src/routes/` as the source of truth for navigation.
- Do not edit generated `src/routeTree.gen.ts`.
- Do not reintroduce the former school-report application files or assumptions.
