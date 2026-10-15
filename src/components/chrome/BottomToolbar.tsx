import {
  Home,
  Layers,
  Clock,
  Plus,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import { Navigator } from '@/browser';
import { useBrowserStore } from '@/store/browserStore';
import { cn } from '@/lib/utils';

interface BottomToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  tabCount: number;
  onHome: () => void;
  onTabs: () => void;
  onMenu: () => void;
}

export function BottomToolbar({
  canGoBack,
  canGoForward,
  tabCount,
  onHome,
  onTabs,
}: BottomToolbarProps) {
  const { setShowHistory, setShowAI } = useBrowserStore();

  return (
    <div className="flex items-center justify-around h-14 px-1 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ToolBtn onClick={onHome} label="Home">
        <Home className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn onClick={onTabs} label="Tabs">
        <div className="relative">
          <Layers className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
            {tabCount}
          </span>
        </div>
      </ToolBtn>

      <ToolBtn onClick={() => setShowHistory(true)} label="History">
        <Clock className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn
        onClick={() => Navigator.newTab()}
        label="New tab"
        className="!w-11 !h-11 rounded-full bg-primary text-primary-foreground"
      >
        <Plus className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn onClick={() => setShowAI(true)} label="AI">
        <Sparkles className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn disabled={!canGoBack} onClick={() => Navigator.back()} label="Back">
        <ArrowLeft className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn disabled={!canGoForward} onClick={() => Navigator.forward()} label="Forward">
        <ArrowRight className="w-5 h-5" />
      </ToolBtn>

      <ToolBtn onClick={() => Navigator.reload()} label="Reload">
        <RotateCw className="w-5 h-5" />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  disabled,
  label,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
        disabled ? 'text-muted-foreground/35' : 'text-foreground hover:bg-muted active:scale-95',
        className
      )}
    >
      {children}
    </button>
  );
}
