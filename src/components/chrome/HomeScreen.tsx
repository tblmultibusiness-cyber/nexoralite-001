import { useState, useEffect } from 'react';
import { Sparkles, Plus, MessageCircle } from 'lucide-react';
import { Navigator } from '@/browser';
import { useBrowserStore } from '@/store/browserStore';
import {
  ALL_QUICK_SITES,
  loadVisibleIds,
  saveVisibleIds,
  type QuickSite,
} from '@/data/quickAccess';
import { cn } from '@/lib/utils';

const GREETINGS = [
  "Let's explore the web together! 🚀",
  'Your browser, kept simple.',
  'Everything stays inside Nexora.',
  'Ready when you are.',
];

export function HomeScreen() {
  const [greeting] = useState(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  );
  const [visibleIds, setVisibleIds] = useState<string[]>(loadVisibleIds);
  const [editing, setEditing] = useState(false);
  const { setShowAI, setShowBookmarks } = useBrowserStore();

  useEffect(() => {
    saveVisibleIds(visibleIds);
  }, [visibleIds]);

  const visibleSites = ALL_QUICK_SITES.filter((s) => visibleIds.includes(s.id));

  const toggleSite = (id: string) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 scrollbar-hide">
      <div className="mb-1">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-blue-400">Nexora</span>{' '}
          <span className="text-foreground font-semibold">Browser</span>
        </h1>
      </div>
      <div className="flex items-start gap-2 mb-5">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium leading-snug">{greeting}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Your browser, kept simple.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAI(true)}
        className="w-full flex items-center justify-between px-3 py-3 mb-5 rounded-xl bg-card border border-border active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-sky-400" />
          <div className="text-left">
            <p className="text-sm font-medium">Chat with AI</p>
            <p className="text-[11px] text-muted-foreground">Open AI tools inside Nexora</p>
          </div>
        </div>
        <span className="text-muted-foreground text-lg">→</span>
      </button>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Access
        </h2>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="text-xs font-medium text-primary"
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {editing && (
        <div className="mb-4">
          <p className="text-[11px] text-muted-foreground mb-3">
            Tap a site to show or hide it.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_QUICK_SITES.map((site) => {
              const on = visibleIds.includes(site.id);
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => toggleSite(site.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors',
                    on
                      ? 'border-primary/60 bg-primary/10 text-foreground'
                      : 'border-border bg-card text-muted-foreground'
                  )}
                >
                  <span className={site.color}>{site.letter || site.name[0]}</span>
                  {site.name}
                  {on && <span className="text-primary">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-x-3 gap-y-4 mb-8">
        {visibleSites.map((site) => (
          <QuickIcon key={site.id} site={site} onOpen={() => Navigator.go(site.url)} />
        ))}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-12 h-12 rounded-full bg-card border border-border border-dashed flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-[11px] text-muted-foreground">Add website</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Your Bookmarks
        </h2>
        <button
          type="button"
          onClick={() => setShowBookmarks(true)}
          className="text-xs font-medium text-primary"
        >
          Manage
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mb-3">Saved websites stay on this device</p>

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {[
          { name: 'Google', url: 'https://www.google.com', letter: 'G', color: 'text-blue-400' },
          { name: 'Wikipedia', url: 'https://en.wikipedia.org', letter: 'W', color: 'text-slate-200' },
        ].map((b) => (
          <button
            key={b.url}
            type="button"
            onClick={() => Navigator.go(b.url)}
            className="w-full flex items-center gap-3 px-3 py-3 text-left active:bg-muted/50"
          >
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
              <span className={b.color}>{b.letter}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{b.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {b.url.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickIcon({ site, onOpen }: { site: QuickSite; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="flex flex-col items-center gap-1.5 group">
      <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-active:scale-95 transition-transform">
        <span className={cn('text-base font-bold', site.color)}>{site.letter || site.name[0]}</span>
      </div>
      <span className="text-[11px] text-muted-foreground truncate w-full text-center">
        {site.name}
      </span>
    </button>
  );
}
