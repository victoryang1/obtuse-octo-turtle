import React, { useState } from 'react';
import CurriculumMap from './components/Map/CurriculumMap';
import QuestView from './components/Quest/QuestView';
import HallOfProcess from './components/HallOfProcess';
import { BookOpen, Trophy } from 'lucide-react';

function App() {
  const [view, setView] = useState('map'); // 'map' | 'quest'
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [showHall, setShowHall] = useState(false);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setView('quest');
  };

  const handleBackToMap = () => {
    setView('map');
    setSelectedNode(null);
  };

  const handleQuestComplete = (nodeId) => {
    setCompletedNodes((prev) => [...new Set([...prev, nodeId])]);
    setView('map');
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Hall of Process Modal */}
      {showHall && (
        <HallOfProcess
          completedNodeIds={completedNodes}
          onClose={() => setShowHall(false)}
        />
      )}

      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('map')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
            Episteme <span className="text-slate-500 font-normal text-sm ml-2">Exploratory Learning Engine</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <button
            onClick={() => setShowHall(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-amber-500/50 transition-all flex items-center gap-2 group"
          >
            <Trophy className="w-4 h-4 text-amber-500 group-hover:text-amber-400" />
            <span className="hidden sm:inline">Hall of Process</span>
          </button>
          <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-bold">{completedNodes.length} / 8</span>
            <span className="hidden sm:inline">Nodes</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        {view === 'map' ? (
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Your Journey Map</h2>
                <p className="text-slate-400">Navigate the fog to unlock new knowledge constellations.</p>
              </div>
            </div>

            <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <CurriculumMap
                completedNodes={completedNodes}
                onNodeSelect={handleNodeSelect}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 h-full">
            <QuestView
              key={selectedNode?.id} // Reset state on node change
              node={selectedNode}
              onBack={handleBackToMap}
              onComplete={handleQuestComplete}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
