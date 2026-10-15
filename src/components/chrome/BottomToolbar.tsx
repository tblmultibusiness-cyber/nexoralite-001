import { ArrowLeft, ArrowRight, Home, Layers, MoreHorizontal } from 'lucide-react';
import { Navigator } from '@/browser';
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
  onMenu,
}: BottomToolbarProps) {
  return (
    <div className="flex items-center justify-around h-14 px-2 border-t border-border bg-card/95 backdrop-blur-md safe-bottom">
      <ToolbarButton
        disabled={!canGoBack}
        onClick={() => Navigator.back()}
        label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton
        disabled={!canGoForward}
        onClick={() => Navigator.forward()}
        label="Forward"
      >
        <ArrowRight className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton onClick={onHome} label="Home">
        <Home className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton onClick={onTabs} label="Tabs">
        <div className="relative">
          <Layers className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            {tabCount}
          </span>
        </div>
      </ToolbarButton>

      <ToolbarButton onClick={onMenu} label="Menu">
        <MoreHorizontal className="w-5 h-5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-xl transition-colors',
        disabled
          ? 'text-muted-foreground/40'
          : 'text-foreground hover:bg-muted active:scale-95'
      )}
    >
      {children}
    </button>
  );
}
