# AGENTS.md

## TypeScript conventions

- Always use `type` instead of `interface` for type definitions.
- Use `const` arrow functions instead of `function` declarations (e.g. `const foo = () => {}`).
- Use `export const` directly instead of a separate `export { name }` statement.

## React conventions

- Never use `React` as a namespace/global. Import individual types and functions explicitly (e.g. `import type { CSSProperties } from 'react'`).
- Use `Props` for component prop types (not `ComponentNameProps`) — the file name provides context.
- Use Tailwind CSS for all styling. No inline styles or CSS-in-JS.
- Keep JSX return blocks clean — no `if`/`switch` statements inside the returned JSX. Mappings (`.map`) and `&&` conditionals are fine. If branching logic is needed, extract it to a separate sub-component or helper function.
- Extract reusable or repeated JSX blocks into their own components (can be in the same file as non-exported sub-components).
- Define sub-components **before** the main exported component — treat them like non-hoisted functions where anything referenced must be introduced first. No separator comments needed.
- Place all icon SVGs in `src/client/components/icons/` as reusable components. Never use inline SVG elements in components - always import from the icons directory. Icons should accept a `className` prop to allow flexible sizing via Tailwind classes.

## Quality checks

- Always run `npx tsc --noEmit` before reporting a task done. All type errors must be resolved.
- Always run `npm run lint` before reporting a task done. All lint errors must be resolved.
- Always run `npm test` before reporting a task done. All tests must pass.
- When changing code in the tested scope (`src/client/lib/`, `src/server/lib/`, `src/server/routes/`), add or update the corresponding tests in the colocated `__tests__/` directory. Tests use Vitest.

## Code style

- Never put `if` bodies on the same line as the condition. Always use braces and put the body on its own line:

    ```ts
    // correct
    if (condition) {
        return
    }

    // wrong — single-line body
    if (condition) {
        return
    }
    if (condition) return
    ```

- Use `&&` for conditional rendering, not ternary-to-null: `condition && <Jsx />`, not `condition ? <Jsx /> : null`.

## Planning

- When working on a task driven by a `PLAN.md` file, always update the relevant plan file to reflect progress (e.g. checking off completed steps, noting blockers, or marking the plan as done).
