/**
 * BrowseSurface
 * Native: Capgo WebView is positioned between header/footer by BrowserController.
 *         This React layer is transparent so the native page is visible.
 * Web: iframe loads the page in-app (no window.open).
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
      if (ev.type === 'urlChange') setLoading(true);
    });
    return unsub;
  }, []);

  if (isNative) {
    // Transparent so the managed WebView (sized between chrome) is what the user sees
    return (
      <div className="absolute inset-0 pointer-events-none bg-transparent">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-background/90">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Loading inside Nexora</p>
            <p className="text-xs text-muted-foreground/70 truncate max-w-xs px-4 mt-1">{url}</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-background px-6 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-sm font-medium mt-3">Could not load page</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
            <button
              type="button"
              onClick={() => BrowserController.navigate(url)}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
            >
              Retry in Nexora
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-3">Loading inside Nexora</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
          <p className="text-sm font-medium mb-1">Site blocked embedded view</p>
          <p className="text-xs text-muted-foreground mb-4">
            On the installed app this opens in Nexora’s WebView and stays inside the app.
          </p>
          <button
            type="button"
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
