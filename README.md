# Nexora Browser 001

**Professional in-app browser architecture**  
All browsing happens inside the app. The user never leaves Nexora.

This is a clean-slate redesign of the original Nexora Lite (`nexoralite`).  
Same brand identity (deep blue → electric blue gradients, dark mode default, glowing accents).  
Completely new internal architecture.

---

## Design Goal

> Everything the user does stays inside Nexora.  
> No system browser. No Chrome Custom Tabs. No SFSafariViewController.  
> One persistent native WebView controlled by the app.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                  Nexora Browser 001 (React + Capacitor)           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chrome UI (React) — always visible                         │  │
│  │  • Address Bar + Search Engine Switcher                     │  │
│  │  • Tabs                                                     │  │
│  │  • AI Orb / Summary / Translation                           │  │
│  │  • Bottom Toolbar (Back / Forward / Home / Menu)            │  │
│  │  • Social Sidebar, Bookmarks, History, Settings             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Browser Surface (Native WebView)                           │  │
│  │  • One persistent managed WebView (@capgo/inappbrowser)     │  │
│  │  • Controlled entirely by React via BrowserController       │  │
│  │  • Layered behind or under the React chrome                 │  │
│  │  • Never opens system browser                               │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### Key Components

| Layer | Responsibility |
|-------|----------------|
| **BrowserController** | Owns the single native WebView lifecycle. open / navigate / back / forward / close / inject / message |
| **Chrome UI** | React components that never leave the app (AddressBar, BottomToolbar, Tabs, AIOrb, etc.) |
| **Navigation Service** | Resolves address-bar input → URL, decides search vs direct navigation |
| **Session Manager** | Tabs, history stack, incognito isolation, bookmarks |
| **Native Bridge** | Thin wrapper around `@capgo/inappbrowser` openWebView + events |

### Core Rules

1. There is **exactly one** managed WebView for browsing.
2. All navigation goes through `BrowserController.navigate(url)`.
3. React UI is the permanent chrome (address bar + toolbar always present).
4. The native WebView is layered *behind* or *under* the React chrome using Capgo features (`toBack`, `updateDimensions`, `bringToFront`).
5. Never call `window.open`, never call system browser APIs.
6. Search results can be shown in React (proxy / CSE). Selecting a result loads the URL into the same WebView.

---

## Brand Identity (kept identical)

- **Primary**: Deep blue → vibrant electric blue gradients  
- **Accents**: Soft glowing teal / electric blue  
- **Default mode**: Dark (battery friendly)  
- **Logo & typography**: Same as original Nexora Lite  
- **Feel**: Empowering, joyful, secure, companion-like

---

## Tech Stack

- React 18 + TypeScript + Vite
- Capacitor 8
- `@capgo/inappbrowser` (managed WebView with full control)
- Tailwind + shadcn/ui
- Framer Motion
- Focused state management for the browser session

---

## Project Status

This repository is the **professional rewrite**.  
Architecture first. Implementation follows the design above.

### Next steps (in order)

1. Scaffold the Vite + Capacitor project with brand colors
2. Implement `BrowserController` (single persistent WebView)
3. Build the permanent Chrome UI (AddressBar + BottomToolbar)
4. Wire navigation so every link stays inside the WebView
5. Add in-app search results + AI features on top of the same surface

---

## Difference from original `nexoralite`

| Original | Nexora 001 |
|----------|------------|
| Opens a temporary InAppBrowser overlay | One permanent WebView owned by the app |
| Returns to home screen after close | Chrome UI stays around the browsing surface |
| Mixed system / in-app paths | Zero system browser paths |
| Architecture grew organically | Designed from first principles for in-app browsing |

---

**Repository**: https://github.com/tblmultibusiness-cyber/nexoralite-001  
**Original project**: https://github.com/tblmultibusiness-cyber/nexoralite
