/**
 * BrowseSurface
 * The visible page area.
 * - Native: Capgo WebView is the real surface (opened by BrowserController).
 * - Web: full-area iframe so Google and other sites actually load in-app.
 */

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { BrowserController } from '@/browser';

interface BrowseSurfaceProps {
  url: string;
}

export function BrowseSurface({ url }: BrowseSurfaceProps) {
  const isNative = Capacitor.isNativePlatform();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setKey((k) => k + 1);
  }, [url]);

  useEffect(() => {
    const unsub = BrowserController.subscribe((ev) => {
      if (ev.type === 'pageLoaded') setLoading(false);
      if (ev.type === 'pageError') {
        setLoading(false);
        setError(ev.error);
      }
    });
    return unsub;
  }, []);

  // On native the Capgo WebView is the real browser surface.
  // We show a light status layer under the permanent chrome.
  if (isNative) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading inside Nexora…</p>
            <p className="text-xs text-muted-foreground/70 truncate max-w-xs px-4">{url}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-sm font-medium">Could not load page</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <button
              onClick={() => BrowserController.navigate(url)}
              className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="text-center px-6">
            <p className="text-sm text-muted-foreground mb-1">Page open in Nexora WebView</p>
            <p className="text-xs text-muted-foreground/70 truncate max-w-xs">{url}</p>
          </div>
        )}
      </div>
    );
  }

  // Web build: real iframe so the user can actually browse
  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-3">Loading…</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
          <p className="text-sm font-medium mb-1">This site blocked the in-app view</p>
          <p className="text-xs text-muted-foreground mb-4">
            Some sites (including Google) refuse to load in an iframe. On the installed app they open in Nexora’s own WebView.
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setKey((k) => k + 1);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
          >
            Retry
          </button>
        </div>
      )}
      <iframe
        key={key}
        src={url}
        title="Nexora Browser"
        className="flex-1 w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError('Failed to load');
        }}
      />
    </div>
  );
}
