import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { getAutomations } from './api/mockApi';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeConfigPanel } from './components/forms/NodeConfigPanel';
import { TopNavbar } from './components/layout/TopNavbar';
import { SandboxDrawer } from './components/sandbox/SandboxDrawer';
import { WorkflowSidebar } from './components/sidebar/WorkflowSidebar';
import { useSimulation } from './hooks/useSimulation';
import { useWorkflow } from './hooks/useWorkflow';
import { downloadJson, serializeWorkflow } from './utils/workflow';

const App = () => {
  const {
    nodes,
    edges,
    canUndo,
    canRedo,
    darkMode,
    isLogsOpen,
    logs,
    isSimulating,
    simulationError,
    versions,
    activeVersionId,
    setAutomationActions,
    undo,
    redo,
    autoLayout,
    loadTemplate,
    restoreVersion,
    importWorkflow,
    toggleDarkMode,
    setLogsOpen,
  } = useWorkflow();
  const { runSimulation, validation } = useSimulation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    getAutomations().then(setAutomationActions);
  }, [setAutomationActions]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleExport = () => {
    downloadJson('hr-workflow-designer-export.json', serializeWorkflow(nodes, edges));
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      importWorkflow(text);
      setImportError(null);
    } catch {
      setImportError('Unable to import this JSON file. Please use a valid workflow export.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-mesh-dark' : 'bg-mesh-light'} transition-colors`}>
      <TopNavbar
        onRun={() => void runSimulation()}
        onExport={handleExport}
        onImport={() => fileInputRef.current?.click()}
        onAutoLayout={autoLayout}
        onUndo={undo}
        onRedo={redo}
        onToggleTheme={toggleDarkMode}
        onToggleLogs={() => setLogsOpen(!isLogsOpen)}
        isDarkMode={darkMode}
        isSimulating={isSimulating}
        canUndo={canUndo}
        canRedo={canRedo}
        validationErrors={validation.issues.filter((issue) => issue.severity === 'error').length}
        validationWarnings={validation.issues.filter((issue) => issue.severity === 'warning').length}
      />

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />

      {importError ? (
        <div className="mx-4 mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {importError}
        </div>
      ) : null}

      <main className="grid min-h-[calc(100vh-212px)] gap-4 px-4 py-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <WorkflowSidebar
          onLoadTemplate={loadTemplate}
          versions={versions}
          activeVersionId={activeVersionId}
          onRestoreVersion={restoreVersion}
        />
        <div className="min-h-[640px]">
          <WorkflowCanvas />
        </div>
        <div className="min-h-[640px]">
          <NodeConfigPanel />
        </div>
      </main>

      <SandboxDrawer
        isOpen={isLogsOpen}
        logs={logs}
        isRunning={isSimulating}
        error={simulationError}
        validation={validation}
        onRun={() => void runSimulation()}
        onToggle={() => setLogsOpen(!isLogsOpen)}
      />
    </div>
  );
};

export default App;
