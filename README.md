# ADP Front-End Assessment

This repository contains the front-end assessment for ADP front-end developer position. Documentation is still under development!

## Configuration

The API origin and the users endpoint live in [`src/config/api.ts`](src/config/api.ts) (`API_ORIGIN`, `USERS_ENDPOINT`). Change `API_ORIGIN` there to point the app at another server.

## Known issues

### TODO: users API link is not working (noted on September 30, 2026)

- The API link configured in `src/config/api.ts` is not responding right now.
- A DNS flush (`ipconfig /flushdns`) and other network troubleshooting steps were done from the development machine, without any success.
- Until it is fixed, `useUsers` falls back to the mock values in `src/mocks/users.ts`, and the page shows a "Showing sample data" notice with a "Try again" button.
- To close this TODO: confirm the correct URL, re-test the endpoint from another network, and set `API_ORIGIN` accordingly.
