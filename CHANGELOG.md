l notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Users list UI for administrators: names in a vertical list, each with a toggle that reveals the user's address, and "Expand all" / "Collapse all" controls so several addresses can be open at once
- Atomic design component structure under `src/components` (atoms, molecules, organisms) plus `src/pages/UsersPage`, with shared types in `src/types` and design tokens in `src/styles/tokens.css`
- Variants for loading (skeleton), error (with retry), empty, disabled and missing-address states
- Integration layer: `useUsers` hook and `fetchUsers` service load the users as soon as the app mounts, with a request timeout
- Global API settings in `src/config/api.ts` (`API_ORIGIN`, `USERS_ENDPOINT`) so the origin is changed in one place
- Mock users in `src/mocks/users.ts`, used automatically when the API does not respond, with a "Showing sample data" notice and a "Try again" button
- `Autocomplete` component (accessible combobox) and real-time name search on `UsersPage`
- `Notice` component for non-blocking messages
- Paginated, virtualized `Autocomplete` suggestions: only the visible window is rendered, and a "Load more" button at the end of the list appends the next page (5 names per page); typing resets to the first page
- More mock users (20 in total) so pagination can be exercised without the API
- README "Known issues" section: the API link is not working (TODO, September 30, 2026) despite a DNS flush and other network troubleshooting
- Waikawa gray color palette in `src/styles/palette.css`, mapped to semantic tokens (light and dark) in `src/styles/tokens.css`
- Optimistic UI: `useUsers` uses `useOptimistic` to show sample users immediately while the API loads, plus a loading notice with a spinner, a busy search field and a dimmed list
- Smooth transitions and entry animations for buttons, list items, the expand/collapse panel, the autocomplete dropdown and notices, disabled automatically for users who prefer reduced motion
- Search across every user field (name, phone, address), accent-insensitive, with multi-word matching and phone numbers matched without punctuation
- `Spinner` atom
- Vitest and Testing Library tests for the service, hook, `Autocomplete`, `UsersPage`, `UserList`, `AddressDetails` and `App`, with sample users in `src/test/fixtures`
- `LLMs.md` recording the model, prompt and response for each LLM interaction

### Changed

- Expanded user details show only the address and the phone number (coordinates removed); `AddressDetails` is now `UserDetails`, and the `User` type carries `phone`
- `Autocomplete` is aligned with the width of the other components, its dropdown has its own surface color and shadows so it no longer blends into the user list, and it stays usable while loading
- `App` loads data through `useUsers` and renders `UsersPage`
- `USERS_ENDPOINT` ignores a trailing slash in `API_ORIGIN`
- `UserList` shows a "No matching users" message when a search has no results and keeps expanded names while filtering

### Removed

- Vite starter content and `src/index.css`

## [0.0.1] Initial commit - 2026-09-30 (7 P.M)

### Added

- Quality Gate using `Claude Hooks` and QA Scripts. See [.claude folder](./.claude) for more information
- CI policies using `Github Actions` for a standardized and error-free codebase
- Claude Skills. Also see [.claude folder](./.claude) for more information.