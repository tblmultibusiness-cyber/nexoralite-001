# Nexora Browser 001 — Architecture

## Goal

Everything stays **inside the app**.  
No system browser. No Chrome Custom Tabs. No SFSafariViewController.  
React = permanent chrome. One Capgo managed WebView = the page.

---

## Native engine (real)

Plugin: `@capgo/inappbrowser` — **only** `openWebView` (never `open()`).

| API | Role |
|-----|------|
| `toolbarType: blank` | No native toolbar; React is the chrome |
| `x, y, width, height` | WebView sits between header and footer |
| `updateDimensions` | Resize when chrome height changes |
| `setUrl` | Same WebView, new URL |
| `goBack` / `reload` | Native history / reload |
| `urlChangeEvent` | Address bar sync |
| `browserPageLoaded` / `pageLoadError` | Loading / error |
| `closeEvent` | Back to home |

`useBrowserLayout` measures header + footer and calls `BrowserController.setLayout`.

```
┌─────────────────────────────────────┐
│  React header (title, tabs, address)│
├─────────────────────────────────────┤
│  Capgo WebView (any site, in-app)   │
├─────────────────────────────────────┤
│  React footer (nav, AI, tabs, …)    │
└─────────────────────────────────────┘
```

## Web preview

Iframe under the same chrome. No `window.open`.  
Sites that block iframes still work on device via the native WebView.

## Public path

`Navigator.go` → `SessionManager` → `BrowserController.navigate`  
`Navigator.back` → native `goBack` first, then session history.

## Rules

1. One managed WebView  
2. Never system browser APIs  
3. Never `window.open`  
4. Chrome stays mounted while browsing  
5. Block `javascript:` / `data:` schemes  
