import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  BookOpen,
  Sun,
  Shield,
  Zap,
  Bookmark,
  Bell,
  ChevronDown,
  ChevronRight,
  Globe2,
} from 'lucide-react';
import { Navigator } from '@/browser';
import { ProxyService } from '@/browser/ProxyService';
import { SEARCH_ENGINES } from '@/data/searchEngines';
import { cn } from '@/lib/utils';

interface SettingsScreenProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsScreen({ open, onClose }: SettingsScreenProps) {
  const [engineOpen, setEngineOpen] = useState(true);
  const [proxyOpen, setProxyOpen] = useState(false);
  const [engine, setEngine] = useState(Navigator.getSearchEngine());
  const [dark, setDark] = useState(true);
  const [proxyOn, setProxyOn] = useState(ProxyService.isEnabled());
  const [proxyBase, setProxyBase] = useState(ProxyService.getConfig().baseUrl);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const selectEngine = (e: typeof engine) => {
    setEngine(e);
    Navigator.setSearchEngine(e);
  };

  const toggleProxy = (on: boolean) => {
    ProxyService.setEnabled(on);
    setProxyOn(ProxyService.isEnabled());
  };

  const saveProxyBase = (value: string) => {
    setProxyBase(value);
    ProxyService.setBaseUrl(value);
    setProxyOn(ProxyService.isEnabled());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border pt-[env(safe-area-inset-top)]">
            <h2 className="text-base font-semibold">Settings</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/50 border border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search settings"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Nexora stays on this device.</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
            <Section
              icon={Search}
              title="Search engine"
              subtitle="Choose how address-bar searches work"
              open={engineOpen}
              onToggle={() => setEngineOpen((v) => !v)}
            >
              <p className="text-xs font-medium mb-2 px-1">Default search engine</p>
              <div className="space-y-1.5">
                {SEARCH_ENGINES.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => selectEngine(e)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-xl border text-sm',
                      e.id === engine.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    )}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </Section>

            {/* Proxy / data mode — interim until full stack */}
            <Section
              icon={Globe2}
              title="Proxy / data mode"
              subtitle={proxyOn ? 'On — traffic via proxy' : 'Off — direct in-app WebView'}
              open={proxyOpen}
              onToggle={() => setProxyOpen((v) => !v)}
            >
              <p className="text-[11px] text-muted-foreground mb-3 px-1 leading-relaxed">
                Optional. Use when the network is weak or you need a server in front of sites.
                Native WebView works without this. Paste your proxy base URL when you have one.
              </p>

              <button
                type="button"
                onClick={() => toggleProxy(!proxyOn)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-3 rounded-xl border text-sm mb-3',
                  proxyOn ? 'border-primary bg-primary/10' : 'border-border bg-card'
                )}
              >
                <span className="font-medium">{proxyOn ? 'Proxy on' : 'Proxy off'}</span>
                <span
                  className={cn(
                    'w-10 h-6 rounded-full relative transition-colors',
                    proxyOn ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all',
                      proxyOn ? 'left-4' : 'left-0.5'
                    )}
                  />
                </span>
              </button>

              <label className="text-xs font-medium px-1 block mb-1">Proxy base URL</label>
              <input
                value={proxyBase}
                onChange={(e) => saveProxyBase(e.target.value)}
                placeholder="https://your-proxy.example/p?url="
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm outline-none focus:border-primary"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <p className="text-[11px] text-muted-foreground mt-2 px-1">
                Example: https://proxy.yourdomain.com/fetch?url=
                Your server should fetch the target page and return it (enough for now; improve later).
              </p>
            </Section>

            <SectionRow icon={BookOpen} title="Browsing" subtitle="Website display and browser behavior" />
            <SectionRow
              icon={Sun}
              title="Appearance"
              subtitle={dark ? 'Dark mode on' : 'Light mode'}
              onClick={() => setDark((d) => !d)}
            />
            <SectionRow icon={Shield} title="Privacy and security" subtitle="Private browsing and history" />
            <SectionRow icon={Zap} title="Performance" subtitle="Data preferences and efficiency" />
            <SectionRow icon={Bookmark} title="Bookmarks" subtitle="Manage saved websites" />
            <SectionRow icon={Bell} title="Notifications" subtitle="Choose browser alerts" />
            <SectionRow icon={Shield} title="Protection status" subtitle="Honest status of browser protections" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-2">
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left">
        <Icon className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function SectionRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-left mb-2 active:bg-muted/50"
    >
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
