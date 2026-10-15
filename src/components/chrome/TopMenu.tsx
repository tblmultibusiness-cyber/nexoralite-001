import { useState } from 'react';
import { MoreVertical, Settings, Clock, Layers, WifiOff, Download } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';

export function TopMenu() {
  const [open, setOpen] = useState(false);
  const { setShowSettings, setShowHistory, setShowTabs } = useBrowserStore();

  const items = [
    {
      icon: Settings,
      label: 'Settings',
      action: () => {
        setOpen(false);
        setShowSettings(true);
      },
    },
    {
      icon: Clock,
      label: 'History',
      action: () => {
        setOpen(false);
        setShowHistory(true);
      },
    },
    {
      icon: Layers,
      label: 'Tabs',
      action: () => {
        setOpen(false);
        setShowTabs(true);
      },
    },
    { icon: WifiOff, label: 'Offline pages', action: () => setOpen(false) },
    { icon: Download, label: 'Downloads', action: () => setOpen(false) },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-muted"
        aria-label="Menu"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-border bg-card shadow-xl py-1 overflow-hidden">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted"
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
