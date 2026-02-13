import React from 'react';
import { X, Award, Shield, Zap, Sparkles } from 'lucide-react';
import { curriculumNodes } from '../data/curriculum';

const HallOfProcess = ({ completedNodeIds, onClose }) => {
  const completedNodes = curriculumNodes.filter(node => completedNodeIds.includes(node.id));

  // Mock stats generator
  const getStats = (id) => {
    // Deterministic mock based on ID length or something simple
    const seed = id.length;
    return {
      resilience: 80 + (seed % 20),
      curiosity: 70 + (seed * 2 % 30),
      time: 5 + (seed % 10)
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Hall of Process</h2>
              <p className="text-slate-400 text-sm">Your journey reflected in data.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          {completedNodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <Shield className="w-16 h-16 opacity-20" />
              <p>The Hall is empty. Complete quests to forge your legacy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedNodes.map((node) => {
                const stats = getStats(node.id);
                return (
                  <div key={node.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-indigo-300 group-hover:text-indigo-200 transition-colors">
                          {node.narrativeTitle}
                        </h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{node.title}</p>
                      </div>
                      <Sparkles className="w-5 h-5 text-indigo-500/50 group-hover:text-indigo-400 transition-colors" />
                    </div>

                    <div className="space-y-3">
                      {/* Stat Bar: Resilience */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Resilience</span>
                          <span className="text-emerald-400">{stats.resilience}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${stats.resilience}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stat Bar: Curiosity */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Curiosity</span>
                          <span className="text-amber-400">{stats.curiosity}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${stats.curiosity}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/50 text-xs text-slate-500 italic">
                        "Demonstrated strong analytical thinking by exploring {stats.time} distinct hypotheses."
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallOfProcess;
