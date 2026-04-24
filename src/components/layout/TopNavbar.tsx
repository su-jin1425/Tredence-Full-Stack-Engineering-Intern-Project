import { Button } from '../common/Button';

type TopNavbarProps = {
  onRun: () => void;
  onExport: () => void;
  onImport: () => void;
  onAutoLayout: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleTheme: () => void;
  onToggleLogs: () => void;
  isDarkMode: boolean;
  isSimulating: boolean;
  canUndo: boolean;
  canRedo: boolean;
  validationErrors: number;
  validationWarnings: number;
};

export const TopNavbar = ({
  onRun,
  onExport,
  onImport,
  onAutoLayout,
  onUndo,
  onRedo,
  onToggleTheme,
  onToggleLogs,
  isDarkMode,
  isSimulating,
  canUndo,
  canRedo,
  validationErrors,
  validationWarnings,
}: TopNavbarProps) => (
  <header className="app-panel mx-4 mt-4 flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-start gap-4">
      <div>
        <p className="font-display text-xl font-semibold">
          <a 
          href="https://sujith1425.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline">
            HR Workflow Designer Module By Sujith S
            </a>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Design, validate, simulate, and version internal HR automations from one canvas.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        {validationErrors} errors • {validationWarnings} warnings
      </div>
      <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
        Undo
      </Button>
      <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
        Redo
      </Button>
      <Button variant="ghost" size="sm" onClick={onAutoLayout}>
        Auto-layout
      </Button>
      <Button variant="ghost" size="sm" onClick={onExport}>
        Export JSON
      </Button>
      <Button variant="ghost" size="sm" onClick={onImport}>
        Import JSON
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleLogs}>
        Logs
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleTheme}>
        {isDarkMode ? 'Light' : 'Dark'}
      </Button>
      <Button variant="secondary" onClick={onRun} disabled={isSimulating}>
        {isSimulating ? 'Running...' : 'Run Workflow'}
      </Button>
    </div>
  </header>
);
