/**
 * NavigationService
 * -----------------
 * Turns raw address-bar input into a final URL that BrowserController can load.
 * Never opens anything itself — it only returns a URL.
 */

export interface SearchEngine {
  id: string;
  name: string;
  searchUrl: string; // e.g. "https://www.google.com/search?q="
}

const DEFAULT_ENGINE: SearchEngine = {
  id: 'google',
  name: 'Google',
  searchUrl: 'https://www.google.com/search?q=',
};

/**
 * Resolve user input into a navigable URL.
 * - Real URLs / domains → open directly
 * - Everything else → search on the selected engine
 */
export function resolveInput(raw: string, engine: SearchEngine = DEFAULT_ENGINE): string | null {
  const input = raw.trim();
  if (!input) return null;

  // Already a full URL
  if (/^https?:\/\//i.test(input)) {
    try {
      return new URL(input).toString();
    } catch {
      // fall through to search
    }
  }

  // Looks like a domain (example.com, localhost:3000, etc.)
  const looksLikeDomain =
    !/\s/.test(input) &&
    /^(localhost|[\w-]+(\.[\w-]+)+)(:\d+)?(\/.*)?$/i.test(input);

  if (looksLikeDomain) {
    try {
      return new URL('https://' + input).toString();
    } catch {
      // fall through
    }
  }

  // Treat as search query
  return engine.searchUrl + encodeURIComponent(input);
}

export function isSearchResultsUrl(url: string): boolean {
  try {
    const target = new URL(url);
    const host = target.hostname.toLowerCase();
    const path = target.pathname.toLowerCase();

    if ((host === 'google.com' || host === 'www.google.com') && path === '/search') return true;
    if ((host === 'bing.com' || host === 'www.bing.com') && path === '/search') return true;
    if (host.endsWith('duckduckgo.com')) return true;
    if (host === 'search.brave.com' && path === '/search') return true;
    if (host === 'search.yahoo.com' && path.startsWith('/search')) return true;
    if (host.endsWith('yandex.com') && path.startsWith('/search')) return true;
    if (host.endsWith('ecosia.org') && path.startsWith('/search')) return true;
    if (host.endsWith('perplexity.ai') && path.startsWith('/search')) return true;

    return false;
  } catch {
    return false;
  }
}
