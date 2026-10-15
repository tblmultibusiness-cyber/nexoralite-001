import { EyeOff } from 'lucide-react';
import { SessionManager } from '@/browser';
import { useEffect, useState } from 'react';

export function IncognitoBanner() {
  const [on, setOn] = useState(SessionManager.isIncognito());

  useEffect(() => {
    const id = setInterval(() => setOn(SessionManager.isIncognito()), 500);
    return () => clearInterval(id);
  }, []);

  if (!on) return null;

  return (
    <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-violet-500/15 border-b border-violet-500/30">
      <EyeOff className="w-3.5 h-3.5 text-violet-300" />
      <span className="text-[11px] font-medium text-violet-200">Incognito — history not saved</span>
    </div>
  );
}
