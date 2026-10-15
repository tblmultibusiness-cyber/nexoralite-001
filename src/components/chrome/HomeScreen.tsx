import { Sparkles, Globe, Youtube, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Navigator } from '@/browser';

const QUICK = [
  { name: 'Google', url: 'https://www.google.com', icon: Globe, color: 'text-blue-400' },
  { name: 'YouTube', url: 'https://m.youtube.com', icon: Youtube, color: 'text-red-400' },
  { name: 'Facebook', url: 'https://m.facebook.com', icon: Facebook, color: 'text-blue-500' },
  { name: 'Instagram', url: 'https://www.instagram.com', icon: Instagram, color: 'text-pink-400' },
  { name: 'X', url: 'https://x.com', icon: MessageCircle, color: 'text-sky-400' },
  { name: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon: Globe, color: 'text-slate-300' },
];

export function HomeScreen() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 scrollbar-hide">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">
          <span className="nexora-gradient-text">Nexora</span>
          <span className="text-muted-foreground font-medium ml-1">Browser</span>
        </h1>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Everything stays inside the app. Browse smarter.
      </p>

      {/* Quick Access */}
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Quick Access
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {QUICK.map((site) => (
          <button
            key={site.name}
            onClick={() => Navigator.go(site.url)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center group-active:scale-95 transition-transform">
              <site.icon className={`w-5 h-5 ${site.color}`} />
            </div>
            <span className="text-[11px] text-muted-foreground truncate w-full text-center">
              {site.name}
            </span>
          </button>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-10 p-4 rounded-2xl bg-primary/10 border border-primary/20">
        <p className="text-sm font-medium text-primary mb-1">In-app only</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every page you open loads inside Nexora. No system browser. No leaving the app.
        </p>
      </div>
    </div>
  );
}
