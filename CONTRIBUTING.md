# Contributing to Playwright Automation Framework

We welcome contributions to make this framework even better!

## Getting Started
1.  **Fork** the repository.
2.  **Clone** your fork locally.
3.  Install dependencies: `npm install`
4.  Install browsers: `npx playwright install`

## Development Workflow
1.  Create a new branch: `git checkout -b feature/my-awesome-feature`
2.  Make your changes.
3.  **Run Linting**: `npm run lint` (Fix any errors)
4.  **Format Code**: `npm run format`
5.  Run Tests: `npm test` to ensure no regressions.

## Coding Standards
- Use **TypeScript** for all new logic.
- Follow the **Page Object Model** pattern in `src/pages/`.
- Use **Universal Steps** where possible; create new reusable steps in `src/steps/` only if necessary.
- Add **Logging** using `Logger.info()` instead of `console.log`.

## Pull Requests
- Provide a clear description of your changes.
- Link to any relevant issues or Jira tickets.
- Ensure all CI checks pass.

Thank you for contributing!
