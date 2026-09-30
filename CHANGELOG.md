l notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Users list UI for administrators: names in a vertical list, each with a toggle that reveals the user's address, and "Expand all" / "Collapse all" controls so several addresses can be open at once
- Atomic design component structure under `src/components` (atoms, molecules, organisms) plus `src/pages/UsersPage`, with shared types in `src/types` and design tokens in `src/styles/tokens.css`
- Variants for loading (skeleton), error (with retry), empty, disabled and missing-address states
- Vitest and Testing Library tests for `App`, `UserList` and `AddressDetails`, with sample users in `src/test/fixtures`
- `LLMs.md` recording the model, prompt and response for each LLM interaction

### Changed

- `App` renders `UsersPage` in the loading state until the data layer is added
- `App.test.tsx` now covers the users page instead of the Vite starter

### Removed

- Vite starter content and `src/index.css`

## [0.0.1] Initial commit - 2026-09-30 (7 P.M)

### Added

- Quality Gate using `Claude Hooks` and QA Scripts. See [.claude folder](./.claude) for more information
- CI policies using `Github Actions` for a standardized and error-free codebase
- Claude Skills. Also see [.claude folder](./.claude) for more information.