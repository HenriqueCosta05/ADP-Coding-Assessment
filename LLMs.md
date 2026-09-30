# LLMs

This file includes all the prompts and responses provided from the LLMs, including model information.

## Interaction 1: Users list with expandable addresses

### Model

Claude Sonnet 5.5 (`claude-sonnet-5-5`), run through Claude Code in the Claude desktop app.

### Prompt

> Based on the folder structure, create the base components for the following use case:
> "We need to load data from the JSON API and display the users' names in a vertical list for
> the administrators. The admins would like an expansion/toggle that allows them to view the
> user address information associated with a name or multiple names at once."
> Make sure it fits the codebase rules and best practices, using design patterns where applicable.
> Restrictions:
>
> 1. You are only allowed to create UI, do not proceed with other layers of the application, such as effects, API fetching, etc.
> 2. All components MUST include variants whenever applicable, such as loading, disabled, and others.
> 3. Do not use external skills (user-scope), these are not necessary for the project scope.
> 4. All the information from this conversation should be stored in @LLMs.md file, include the model, the prompt and the llm response

### Response

I built the UI layer only (no fetching, effects, or store). Typecheck, ESLint, the comment policy, the production build and 11 Vitest tests all pass. No user-scope skills were used.

**Layout** (type-based atomic design, co-located CSS Modules, no barrel files)

```
src/
  types/user.ts                       User, Address, Geo (address is nullable)
  styles/tokens.css                   colour/spacing tokens, dark mode
  components/
    atoms/       Button, DisclosureButton, Skeleton
    molecules/   AddressDetails, UserListItem, UserListItemSkeleton, StatusMessage, UserListToolbar
    organisms/   UserList
  pages/UsersPage.tsx                 heading + UserList
  test/fixtures/users.ts              sample users for tests
```

**Patterns**

- **Discriminated-union props.** `UserList` takes `status: 'loading' | 'error' | 'success'`, so each state only accepts the props it needs (`users` only on success, `onRetry` only on error).
- **Controlled leaf components.** `UserListItem` and `DisclosureButton` are stateless; the parent passes `expanded` and `onToggle`.
- **Set-based expansion state.** `UserList` keeps the expanded IDs in a `Set`, which is why several names can be open at once. This is plain UI state, not an effect.
- **Disclosure accessibility.** `aria-expanded`/`aria-controls` on the button, and a `region` panel labelled by it.
- **Variants via `data-variant`.** Styling hooks stay out of class-name string building.

**Variants**

| Component | Variants |
|---|---|
| `Button` | `primary`/`secondary`, `disabled`, `loading` |
| `DisclosureButton` | collapsed/expanded, `disabled` |
| `Skeleton` | `text`/`block` |
| `StatusMessage` | `empty`, `error` (with optional action) |
| `AddressDetails` | address present / "No address on file" |
| `UserListToolbar` | `disabled`; "Expand all" and "Collapse all" disable themselves when there is nothing to do |
| `UserList` | `loading`, `error`, empty, `success`, `disabled` |

**Things to know**

- `App.tsx` renders `<UsersPage status="loading" />` because the data layer is out of scope. When you add fetching, pass `status="success" users={...}` instead.
- The `User` type covers only `id`, `name` and `address`, following the typical JSON placeholder shape. Adjust it if your API differs.
- I replaced the stale `App.test.tsx` (it tested the old Vite starter). `App.tsx` now imports `App.css` (the reset) and `tokens.css`, since `index.css` was deleted in your working tree.
- `npm run qa:audit` fails here with `exit null` because Node cannot spawn `bash` from PowerShell on this machine. Running `qa-precheck.sh` through Git Bash passes for all three test files, so this is environmental.
- Node is not on PATH in this shell. I activated it with fnm (Node 24, per `.nvmrc`).

## Interaction 2: Changelog entry

### Model

Claude Sonnet 5.5 (`claude-sonnet-5-5`), run through Claude Code in the Claude desktop app.

### Prompt

> Finally, add this commit in changelog file. Then, I will commit it

### Response

I added the entry under `[Unreleased]` in `CHANGELOG.md`, grouped as Added, Changed and Removed. I didn't commit anything.

Your working tree was in the middle of moving components into per-component folders. `git status` showed the old flat files as deleted next to the new untracked folders, and `UserList.tsx` still imported `../molecules/UserListItem` and `UserListItemSkeleton` from the old paths. I advised checking that those imports resolve, and staging the new folders, before committing.

## Interaction 3: Import fixes and LLMs.md update

### Model

Claude Sonnet 5.5 (`claude-sonnet-5-5`), run through Claude Code in the Claude desktop app.

### Prompt

> Update the imports according to the folder structure I've created. Also, update the LLM file to include the interactions I've done after the first one

### Response

I updated the relative imports to match the per-component folders:

- `AddressDetails.tsx`, `AddressDetails.test.tsx` and `UserListItem.tsx`: `types/user` and `test/fixtures/users` now resolve from `../../../`.
- `UserListItem.tsx`: `DisclosureButton` from `../../atoms/DisclosureButton/DisclosureButton`, `AddressDetails` from `../AddressDetails/AddressDetails`.
- `UserListItemSkeleton.tsx`: `Skeleton` from `../../atoms/Skeleton/Skeleton`.
- `UserList.tsx`: `UserListItem` and `UserListItemSkeleton` from `../molecules/UserListItem/`.

Typecheck, ESLint and all 11 tests pass after the change. `UserList` itself is still a flat file in `organisms/`, so its imports were left as they are. I also added interactions 2 and 3 to this file.
