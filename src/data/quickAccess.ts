export interface QuickSite {
  id: string;
  name: string;
  url: string;
  color: string; // tailwind text color class
  letter?: string; // fallback letter mark
}

export const ALL_QUICK_SITES: QuickSite[] = [
  { id: 'google', name: 'Google', url: 'https://www.google.com', color: 'text-blue-400', letter: 'G' },
  { id: 'youtube', name: 'YouTube', url: 'https://m.youtube.com', color: 'text-red-500', letter: '▶' },
  { id: 'facebook', name: 'Facebook', url: 'https://m.facebook.com', color: 'text-blue-500', letter: 'f' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://web.whatsapp.com', color: 'text-green-400', letter: 'W' },
  { id: 'x', name: 'X', url: 'https://x.com', color: 'text-slate-100', letter: '𝕏' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com', color: 'text-pink-400', letter: 'IG' },
  { id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com', color: 'text-fuchsia-300', letter: '♪' },
  { id: 'netflix', name: 'Netflix', url: 'https://www.netflix.com', color: 'text-red-600', letter: 'N' },
  { id: 'reddit', name: 'Reddit', url: 'https://www.reddit.com', color: 'text-orange-500', letter: 'r' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', color: 'text-red-400', letter: 'M' },
  { id: 'snapchat', name: 'Snapchat', url: 'https://www.snapchat.com', color: 'text-yellow-400', letter: '👻' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://en.m.wikipedia.org', color: 'text-slate-200', letter: 'W' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com', color: 'text-teal-400', letter: 'b' },
  { id: 'telegram', name: 'Telegram', url: 'https://web.telegram.org', color: 'text-sky-400', letter: '✈' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com', color: 'text-blue-600', letter: 'in' },
  { id: 'amazon', name: 'Amazon', url: 'https://www.amazon.com', color: 'text-orange-400', letter: 'a' },
  { id: 'pinterest', name: 'Pinterest', url: 'https://www.pinterest.com', color: 'text-red-500', letter: 'P' },
];

const STORAGE_KEY = 'nexora-001-quick-visible';

const DEFAULT_VISIBLE = [
  'google', 'youtube', 'facebook', 'whatsapp',
  'x', 'instagram', 'tiktok', 'netflix',
  'reddit', 'gmail', 'snapchat', 'wikipedia', 'bing',
];

export function loadVisibleIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_VISIBLE;
}

export function saveVisibleIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
