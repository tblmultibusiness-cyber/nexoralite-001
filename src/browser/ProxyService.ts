/**
 * ProxyService — interim proxy / data mode
 *
 * When enabled, navigations are rewritten through a configurable proxy base URL.
 * Enough for now (weak networks, web iframe fallback, future data-saving).
 * Replace PROXY_BASE later with your own worker / server.
 *
 * Contract for your future proxy:
 *   GET {proxyBase}{encodeURIComponent(https://example.com/path)}
 *   or  GET {proxyBase}?url={encodeURIComponent(...)}
 * Proxy should fetch the target and return HTML (optionally strip X-Frame-Options).
 */

const STORAGE_KEY = 'nexora-001-proxy';

export type ProxyMode = 'off' | 'on';

export interface ProxyConfig {
  mode: ProxyMode;
  /** e.g. https://proxy.yourdomain.com/p?url=  or  https://proxy.yourdomain.com/p/ */
  baseUrl: string;
  /** If true, append target as query ?url= ; if false, append encoded path after base */
  useQueryParam: boolean;
}

const DEFAULT: ProxyConfig = {
  mode: 'off',
  // Empty until you set your own. App still works without proxy (native WebView).
  baseUrl: '',
  useQueryParam: true,
};

function load(): ProxyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT };
}

function save(cfg: ProxyConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

let config: ProxyConfig = load();

export const ProxyService = {
  getConfig(): ProxyConfig {
    return { ...config };
  },

  isEnabled(): boolean {
    return config.mode === 'on' && !!config.baseUrl.trim();
  },

  setEnabled(on: boolean) {
    config = { ...config, mode: on ? 'on' : 'off' };
    save(config);
  },

  setBaseUrl(baseUrl: string) {
    config = { ...config, baseUrl: baseUrl.trim() };
    save(config);
  },

  setUseQueryParam(useQueryParam: boolean) {
    config = { ...config, useQueryParam };
    save(config);
  },

  /**
   * If proxy mode is on and configured, return the proxied URL.
   * Otherwise return the original URL unchanged.
   * Never proxies about:blank or empty.
   */
  apply(url: string): string {
    if (!url || url === 'about:blank') return url;
    if (!this.isEnabled()) return url;

    // Already going through our proxy — don't double-wrap
    if (url.startsWith(config.baseUrl)) return url;

    const base = config.baseUrl;
    if (config.useQueryParam) {
      const sep = base.includes('?') ? (base.endsWith('=') || base.endsWith('&') ? '' : '&url=') : '?url=';
      // If base already ends with url= or ?
      if (/[?&]url=$/.test(base) || base.endsWith('url=')) {
        return base + encodeURIComponent(url);
      }
      if (base.includes('?')) {
        return base + (base.endsWith('&') || base.endsWith('?') ? '' : '&') + 'url=' + encodeURIComponent(url);
      }
      return base + sep + encodeURIComponent(url);
    }

    // Path-style: base + encodeURIComponent(url)
    const slash = base.endsWith('/') ? '' : '/';
    return base + slash + encodeURIComponent(url);
  },

  /** Extract original URL if this is a proxied URL we created */
  unwrap(url: string): string {
    if (!config.baseUrl || !url.startsWith(config.baseUrl.split('?')[0])) {
      return url;
    }
    try {
      const u = new URL(url);
      const q = u.searchParams.get('url');
      if (q) return q;
    } catch { /* ignore */ }
    return url;
  },
};
