# Nexora Browser 001 — Architecture Specification

## 1. Goal

Create a true **in-app browser** experience where:

- The user never leaves the Nexora application.
- There is never a system browser (Chrome Custom Tabs / SFSafariViewController).
- All page loading happens inside one controlled native WebView.
- The React layer is the permanent browser chrome (address bar, tabs, AI tools, bottom toolbar).

## 2. Core Design Decision

**One persistent managed WebView** owned by a `BrowserController`.

The React app does **not** open temporary browser windows.  
It controls a single long-lived WebView and keeps its own UI around it forever.

This is the opposite of the classic “open InAppBrowser then close it” pattern used in the original `nexoralite`.

## 3. Layers

### 3.1 BrowserController (Native Bridge + State)

Location: `src/browser/BrowserController.ts`

Responsibilities:
- Create and keep alive **one** `@capgo/inappbrowser` WebView instance.
- Expose a clean API to the rest of the app:
  - `open(url: string)`
  - `navigate(url: string)`
  - `goBack()` / `goForward()`
  - `reload()`
  - `close()` (rarely used)
  - `executeScript(code: string)`
  - `postMessage(data)`
- Listen to native events (`urlChangeEvent`, `browserPageLoaded`, `closeEvent`, etc.) and keep React state in sync.
- Handle dimension updates so the WebView sits correctly under the React chrome.

### 3.2 Session Manager

Location: `src/browser/SessionManager.ts` (or Zustand store)

- Tabs (multiple logical tabs can share the same physical WebView or we can support multiple later).
- Navigation history stack (for back/forward).
- Current URL, title, favicon.
- Incognito mode isolation.
- Bookmarks & history persistence.

### 3.3 Navigation Service

Location: `src/browser/NavigationService.ts`

- Takes raw address-bar input.
- Decides: is it a URL or a search query?
- Builds the final URL using the currently selected search engine.
- Calls `BrowserController.navigate(finalUrl)`.

### 3.4 Chrome UI (React)

Always visible components:

- `AddressBar` — input + search engine switcher + progress indicator
- `BottomToolbar` — Back, Forward, Home, Tabs, Menu
- `TabBar` / Tab overview
- `AIOrb` + summary / translation panels
- Side panels (Social, Bookmarks, History, Settings)

These components never unmount when the user is browsing.  
They sit above or around the native WebView.

### 3.5 Brand & Theme

Kept identical to original Nexora:

- Primary gradient: deep blue → electric blue
- Accent glow: teal / electric blue
- Default: dark mode
- Same logo treatment and typography feel

## 4. Data Flow (Navigation Example)

1. User types in AddressBar and presses Go.
2. `NavigationService.resolve(input)` → final URL.
3. `SessionManager` updates current tab + history.
4. `BrowserController.navigate(url)` tells the native WebView to load the URL.
5. Native `urlChangeEvent` fires → React AddressBar updates.
6. Page finishes loading → AI tools can inject scripts or request summary.

## 5. Rules That Must Never Be Broken

1. Never call `window.open()`.
2. Never call the system browser / Custom Tabs / SFSafariViewController.
3. All external content loads only through `BrowserController`.
4. The React chrome stays mounted for the entire browsing session.
5. Search results (if shown in React) only hand a URL to `BrowserController` when the user taps them.

## 6. Future Extensions

- Multiple simultaneous WebViews (one per tab) if needed for true multi-tab isolation.
- Server-side data compression proxy (Opera Mini style) for extreme data savings.
- Advanced script injection for ad blocking / reading mode / translation.
- Offline cache of pages.

## 7. Why This Architecture

The original project treated the browser as an external overlay.  
This design treats the browser as the **core surface** of the application, with React providing the chrome around it.

This is how real mobile browsers are structured and is the only reliable way to keep the user inside the app for the entire session.
