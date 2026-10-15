# Nexora Browser 001

**Professional in-app browser architecture**  
All browsing happens inside the app. The user never leaves Nexora.

Clean-slate redesign. Same brand identity (deep blue → electric blue, dark mode, glowing accents).

---

## Design Goal

> Everything stays inside Nexora.  
> No system browser. No Chrome Custom Tabs. No SFSafariViewController.  
> One persistent native WebView controlled by the app.

---

## What is built

### Core engine
- `BrowserController` — single managed WebView, never opens system browser
- `SessionManager` — tabs, history stack, incognito
- `NavigationService` — address bar → URL
- `Navigator` — **only** public entry point for all browsing

### Chrome UI (always on screen)
- AddressBar + Search Engine Switcher (Google, Bing, DuckDuckGo, Brave, Ecosia, Yahoo, Yandex, Perplexity)
- BottomToolbar (Back / Forward / Home / Tabs / Menu)
- HomeScreen with Quick Access + tips
- TabsOverview
- MenuSheet
- HistoryScreen
- BookmarksScreen (localStorage)
- SettingsScreen (dark mode)
- PrivacyScreen
- AIOrb + AIPanel (companion sheet)

### State
- Zustand `browserStore` for reactive UI

---

## Architecture rules (enforced in code)

1. Exactly one managed WebView
2. All navigation goes through `Navigator.go()` → `BrowserController`
3. React chrome never unmounts while browsing
4. No `window.open`, no system browser APIs
5. Dangerous schemes blocked

---

## Brand

- Primary: deep blue → electric blue gradients
- Accents: teal / electric blue glow
- Default: dark mode
- Feel: companion, secure, joyful

---

## Stack

- React 18 + TypeScript + Vite
- Capacitor 8
- `@capgo/inappbrowser`
- Tailwind + Framer Motion + Zustand + Lucide

---

## Run locally

```bash
npm install
npm run dev
```

For native:

```bash
npx cap add android   # or ios
npx cap sync
npx cap open android
```

---

## Repo

https://github.com/tblmultibusiness-cyber/nexoralite-001
