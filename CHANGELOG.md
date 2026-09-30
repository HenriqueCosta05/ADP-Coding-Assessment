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
- README "Known issues" section: the API link is not working (TODO, September 30, 2026) despite a DNS flush and other network troubleshooting
- Vitest and Testing Library tests for the service, hook, `Autocomplete`, `UsersPage`, `UserList`, `AddressDetails` and `App`, with sample users in `src/test/fixtures`
- `LLMs.md` recording the model, prompt and response for each LLM interaction

### Changed

- `App` loads data through `useUsers` and renders `UsersPage`
- `UserList` shows a "No matching users" message when a search has no results and keeps expanded names while filtering

### Removed

- Vite starter content and `src/index.css`

## [0.0.1] Initial commit - 2026-09-30 (7 P.M)

### Added

- Quality Gate using `Claude Hooks` and QA Scripts. See [.claude folder](./.claude) for more information
- CI policies using `Github Actions` for a standardized and error-free codebase
- Claude Skills. Also see [.claude folder](./.claude) for more information.