'use client';

import { FC, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

interface PredictionEngineProps {
  onActivateGraphics: (playerName: string) => void;
}

export const PredictionEngine: FC<PredictionEngineProps> = ({ onActivateGraphics }) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  useEffect(() => {
    // Listen for tool calls in the messages array
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.toolInvocations) {
      for (const invocation of lastMessage.toolInvocations) {
        if (invocation.toolName === 'showPlayerGraphics') {
          const args = invocation.args as any;
          if (args && args.playerName) {
            onActivateGraphics(args.playerName);
          }
        }
      }
    }
  }, [messages, onActivateGraphics]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[850px] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-4 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Crickvay Intelligence" className="h-9 w-auto object-contain" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 p-5 overflow-y-auto bg-white space-y-6">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
          System Initialized
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col space-y-1.5 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
              {m.role === 'user' ? (
                <span className="text-slate-500">Analyst Query</span>
              ) : (
                <span className="text-blue-600">Crickvay Engine</span>
              )}
            </div>
            <div className="pl-3 border-l-[3px] border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Enter tactical query..."
            className="flex-1 bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-sm"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
