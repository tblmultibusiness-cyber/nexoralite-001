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
} from 'lucide-react';
import { Navigator } from '@/browser';
import { SEARCH_ENGINES } from '@/data/searchEngines';
import { cn } from '@/lib/utils';

interface SettingsScreenProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsScreen({ open, onClose }: SettingsScreenProps) {
  const [engineOpen, setEngineOpen] = useState(true);
  const [engine, setEngine] = useState(Navigator.getSearchEngine());
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const selectEngine = (e: typeof engine) => {
    setEngine(e);
    Navigator.setSearchEngine(e);
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
            {/* Search engine */}
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
              <p className="text-[11px] text-muted-foreground mt-2 px-1">
                Used when you enter a search instead of a website address.
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
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
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
