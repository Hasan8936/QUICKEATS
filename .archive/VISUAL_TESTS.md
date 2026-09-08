Visual Tests

Open the UI tests page in the running app to preview components and validate accessibility.

1. Start the dev server:

```bash
npm install
npm run dev
```

2. Open: http://localhost:3000/ui-tests

What to check
- Keyboard navigation: open cart, press `Tab` to cycle, `Shift+Tab` backwards, `Esc` to close.
- Focus return: after closing, focus should return to the element that opened the drawer.
- Mobile/Responsive: resize the browser to mobile widths and inspect layout.

Automated Playwright snapshots have been added. To run them locally:

1. Install test deps and browsers:

```bash
npm install
npx playwright install --with-deps
```

2. Run Playwright tests (headless):

```bash
npm run test:playwright
```

3. Run headed (debug) mode:

```bash
npm run test:playwright:headed
```

Screenshots will be saved to `screenshots/` in the repository root.
