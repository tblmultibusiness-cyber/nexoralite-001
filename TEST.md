# Test the engine now

## Web (fastest)

```bash
git clone https://github.com/tblmultibusiness-cyber/nexoralite-001.git
cd nexoralite-001
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

### What to try
1. Tap **Google** or **Wikipedia** on the home screen
2. Type a URL in the address bar (e.g. `example.com`) and submit
3. Type a search (e.g. `nexora browser`) and submit
4. Use Back / Forward / Home / Tabs

Pages load in the **in-app surface** (iframe on web, Capgo WebView on native).

**Note:** Google and some sites block iframes on the web build. Wikipedia, example.com, and many others work. On a real device with Capacitor, Google opens in Nexora’s own WebView and stays inside the app.

## Native (full engine)

```bash
npm install
npm run build
npx cap add android   # or ios
npx cap sync
npx cap open android
```

Then run on a device/emulator. Every site loads inside Nexora only.
