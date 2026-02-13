import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Check, X as XIcon, ArrowLeft } from 'lucide-react';

const MOCK_QUESTS = {
  intro: {
    title: "The Awakening",
    narrative: "You stand before the gates of the ancient Academy, long sealed by the Fog of Ignorance. To enter, you must prove you possess the spark of curiosity.",
    problem: "You find a strange, glowing artifact on the ground. It hums with a low vibration. As an explorer of Episteme, what is your first action?",
    options: [
      { id: 'a', text: "Immediately hit it with a hammer to see what's inside." },
      { id: 'b', text: "Observe its properties and ask questions about what it might be." },
      { id: 'c', text: "Ignore it and walk away." }
    ],
    correctId: 'b',
    responses: {
      correct: "Excellent! Observation is the foundation of all science. By asking questions, you begin to clear the fog.",
      hints: [
        "Think about safety and gathering information first.",
        "Scientists don't destroy things immediately; they look and wonder.",
        "Breaking it might be dangerous. Is there a gentler way to learn?"
      ]
    }
  },
  force: {
    title: "Kinetic Canyon",
    narrative: "The path ahead is blocked by massive boulders. The wind howls through the canyon, but the rocks do not move. You need to clear the way.",
    problem: "A large boulder is at rest. It will not move on its own. What must happen for the boulder to change its position?",
    options: [
      { id: 'a', text: "It needs to be heavier." },
      { id: 'b', text: "A force (a push or a pull) must be applied to it." },
      { id: 'c', text: "It needs to wait for the sun to set." }
    ],
    correctId: 'b',
    responses: {
      correct: "Correct! Nothing moves without a force. You apply your strength, and the boulder rolls aside, revealing the path.",
      hints: [
        "Does weight make things move, or make them harder to move?",
        "Time of day doesn't affect motion directly.",
        "Imagine you are pushing a toy car. What makes it go?"
      ]
    }
  },
  default: {
    title: "Uncharted Territory",
    narrative: "You have ventured into a region not yet fully mapped by the cartographers.",
    problem: "This concept is under construction. Select the only option to proceed.",
    options: [
      { id: 'a', text: "Proceed with caution." }
    ],
    correctId: 'a',
    responses: {
      correct: "Wise choice.",
      hints: ["Just pick the option."]
    }
  }
};

const QuestView = ({ node, onBack, onComplete }) => {
  const quest = MOCK_QUESTS[node.id] || MOCK_QUESTS.default;
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Welcome to ${quest.title}. I am your guide. ${quest.narrative}` },
    { sender: 'ai', text: quest.problem }
  ]);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleOptionSelect = (option) => {
    if (isCompleted) return;

    // Add user selection to chat
    const newMessages = [...messages, { sender: 'user', text: option.text }];

    if (option.id === quest.correctId) {
      // Correct
      newMessages.push({ sender: 'ai', text: quest.responses.correct, type: 'success' });
      setIsCompleted(true);
    } else {
      // Incorrect
      const hintIndex = Math.min(attempts, quest.responses.hints.length - 1);
      const hint = quest.responses.hints[hintIndex];
      newMessages.push({ sender: 'ai', text: `Not quite. ${hint}`, type: 'hint' });
      setAttempts(prev => prev + 1);
    }

    setMessages(newMessages);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-xl font-bold text-indigo-400">{quest.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-widest">Resilience: {attempts > 0 ? 'Testing' : 'Stable'}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Visuals & Options */}
        <div className="w-2/3 bg-slate-800/50 p-6 flex flex-col border-r border-slate-700 overflow-y-auto">
          <div className="mb-8">
            <div className="h-48 bg-indigo-900/30 rounded-lg flex items-center justify-center border border-indigo-500/30 mb-4 relative overflow-hidden group">
               {/* Abstract Visual */}
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
               <p className="relative z-10 text-indigo-300 font-light italic text-center px-4">
                 "{quest.narrative}"
               </p>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">The Challenge</h3>
            <p className="text-slate-400 leading-relaxed">{quest.problem}</p>
          </div>

          <div className="space-y-3 mt-auto">
            {quest.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                disabled={isCompleted}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-center justify-between group
                  ${isCompleted && option.id === quest.correctId
                    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200'
                    : isCompleted
                      ? 'opacity-50 cursor-not-allowed border-slate-700'
                      : 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-700'
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border
                    ${isCompleted && option.id === quest.correctId ? 'border-emerald-500 text-emerald-500' : 'border-slate-600 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-400'}
                  `}>
                    {option.id.toUpperCase()}
                  </span>
                  {option.text}
                </span>
                {isCompleted && option.id === quest.correctId && <Check className="w-5 h-5 text-emerald-400" />}
              </button>
            ))}
          </div>

          {isCompleted && (
            <button
              onClick={() => onComplete(node.id)}
              className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-[1.02]"
            >
              Quest Complete - Continue Journey
            </button>
          )}
        </div>

        {/* Right Pane: Chat Interface */}
        <div className="w-1/3 bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Mentor Feedback
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : msg.type === 'success'
                      ? 'bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 rounded-tl-sm'
                      : msg.type === 'hint'
                        ? 'bg-amber-900/20 border border-amber-500/30 text-amber-200 rounded-tl-sm'
                        : 'bg-slate-800 text-slate-300 rounded-tl-sm border border-slate-700'
                  }
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Placeholder (Mock) */}
          <div className="p-4 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Select an option..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-slate-500 text-sm focus:outline-none cursor-not-allowed"
              />
              <Send className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestView;
