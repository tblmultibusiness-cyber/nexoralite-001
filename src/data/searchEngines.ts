import type { SearchEngine } from '@/browser';

export const SEARCH_ENGINES: SearchEngine[] = [
  { id: 'google', name: 'Google', searchUrl: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', searchUrl: 'https://www.bing.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', searchUrl: 'https://duckduckgo.com/?q=' },
  { id: 'brave', name: 'Brave', searchUrl: 'https://search.brave.com/search?q=' },
  { id: 'ecosia', name: 'Ecosia', searchUrl: 'https://www.ecosia.org/search?q=' },
  { id: 'yahoo', name: 'Yahoo', searchUrl: 'https://search.yahoo.com/search?p=' },
  { id: 'yandex', name: 'Yandex', searchUrl: 'https://yandex.com/search/?text=' },
  { id: 'perplexity', name: 'Perplexity', searchUrl: 'https://www.perplexity.ai/search?q=' },
];

export const DEFAULT_ENGINE = SEARCH_ENGINES[0];
