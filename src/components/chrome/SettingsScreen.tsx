import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Moon, Globe, Shield, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsScreenProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsScreen({ open, onClose }: SettingsScreenProps) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

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
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Settings</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Appearance</h3>
              <button
                onClick={() => setDark(!dark)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <span className="text-sm">Dark mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${dark ? 'bg-primary' : 'bg-muted'} relative`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dark ? 'left-5' : 'left-1'}`} />
                </div>
              </button>
            </section>

            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Browsing</h3>
              <div className="rounded-xl bg-card border border-border divide-y divide-border">
                <div className="flex items-center gap-3 p-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm">In-app only</p>
                    <p className="text-[11px] text-muted-foreground">All pages load inside Nexora</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm">Privacy shield</p>
                    <p className="text-[11px] text-muted-foreground">No system browser is ever opened</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
              <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Nexora Browser 001</p>
                  <p className="text-[11px] text-muted-foreground">Professional in-app browser architecture</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
