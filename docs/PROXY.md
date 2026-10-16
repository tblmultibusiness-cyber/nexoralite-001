# Proxy / data mode (interim)

Enough for now. Replace with a stronger stack later.

## In the app

1. **Settings → Proxy / data mode**
2. Turn **Proxy on**
3. Set **Proxy base URL**, e.g. `https://your-domain.com/fetch?url=`

When on, every navigation becomes:

```text
https://your-domain.com/fetch?url=https%3A%2F%2Fwww.google.com%2F
```

History/address bar still store the **real** site URL.

## Minimal proxy (Node example)

```js
// server.mjs — enough for testing
import http from 'node:http';

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const target = u.searchParams.get('url');
  if (!target) {
    res.writeHead(400);
    res.end('missing url');
    return;
  }
  try {
    const r = await fetch(target, {
      headers: { 'user-agent': req.headers['user-agent'] || 'NexoraBrowser/1' },
      redirect: 'follow',
    });
    const body = Buffer.from(await r.arrayBuffer());
    const headers = Object.fromEntries(r.headers);
    // Allow embedding in web preview if needed
    delete headers['x-frame-options'];
    delete headers['content-security-policy'];
    res.writeHead(r.status, headers);
    res.end(body);
  } catch (e) {
    res.writeHead(502);
    res.end(String(e));
  }
}).listen(8787, () => console.log('proxy on :8787'));
```

Point the app at `http://YOUR_LAN_IP:8787/fetch?url=` while testing.

## Notes

- **Native WebView does not require proxy** for Google — direct load works.
- Proxy helps weak networks, optional data saving, and web iframe testing.
- Do not ship a public open proxy; lock it to your app / auth later.
