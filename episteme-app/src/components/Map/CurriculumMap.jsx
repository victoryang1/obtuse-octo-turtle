import React, { useMemo } from 'react';
import { Lock, Check, Star, BookOpen } from 'lucide-react';
import { curriculumNodes } from '../../data/curriculum';

const CurriculumMap = ({ completedNodes = [], onNodeSelect }) => {
  // compute status for each node
  const nodesWithStatus = useMemo(() => {
    return curriculumNodes.map((node) => {
      const isCompleted = completedNodes.includes(node.id);

      // Check if all prerequisites are met
      const prerequisitesMet = node.prerequisites.length === 0 ||
        node.prerequisites.every(preId => completedNodes.includes(preId));

      let status = 'locked';
      if (isCompleted) status = 'completed';
      else if (prerequisitesMet) status = 'unlocked';

      return { ...node, status };
    });
  }, [completedNodes]);

  // Calculate edges
  const edges = useMemo(() => {
    const edgeList = [];
    nodesWithStatus.forEach((node) => {
      node.prerequisites.forEach((preId) => {
        const preNode = curriculumNodes.find(n => n.id === preId);
        if (preNode) {
          edgeList.push({
            from: preNode,
            to: node,
            status: node.status === 'locked' ? 'locked' : 'unlocked'
          });
        }
      });
    });
    return edgeList;
  }, [nodesWithStatus]);

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Background Grid/Texture */}
      <div className="absolute inset-0 opacity-10"
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Narrative Title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-2xl font-bold text-slate-100 tracking-wider">Campaign: The Genesis</h2>
        <p className="text-slate-400 text-sm">Sector 2: Foundation of Science</p>
      </div>

      {/* SVG Layer for Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, idx) => (
          <line
            key={idx}
            x1={`${edge.from.position.x}%`}
            y1={`${edge.from.position.y}%`}
            x2={`${edge.to.position.x}%`}
            y2={`${edge.to.position.y}%`}
            stroke={edge.status === 'locked' ? '#334155' : '#6366f1'}
            strokeWidth="2"
            strokeDasharray={edge.status === 'locked' ? '5,5' : '0'}
            className="transition-colors duration-500"
          />
        ))}
      </svg>

      {/* Nodes Layer */}
      {nodesWithStatus.map((node) => (
        <div
          key={node.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
            ${node.status === 'locked' ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
          `}
          style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
          onClick={() => node.status !== 'locked' && onNodeSelect(node)}
        >
          {/* Node Circle */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg
            ${node.status === 'completed' ? 'bg-emerald-600 border-emerald-400 shadow-emerald-900/50' : ''}
            ${node.status === 'unlocked' ? 'bg-indigo-600 border-indigo-400 animate-pulse shadow-indigo-900/50' : ''}
            ${node.status === 'locked' ? 'bg-slate-700 border-slate-600' : ''}
          `}>
            {node.status === 'locked' && <Lock className="w-6 h-6 text-slate-400" />}
            {node.status === 'unlocked' && <Star className="w-8 h-8 text-white fill-yellow-400" />}
            {node.status === 'completed' && <BookOpen className="w-8 h-8 text-white" />}
          </div>

          {/* Label */}
          <div className={`
            mt-2 text-center w-32 px-2 py-1 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700
            transition-opacity duration-300
            ${node.status === 'locked' ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
          `}>
            <p className={`text-xs font-bold ${node.status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>
              {node.narrativeTitle}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{node.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurriculumMap;
