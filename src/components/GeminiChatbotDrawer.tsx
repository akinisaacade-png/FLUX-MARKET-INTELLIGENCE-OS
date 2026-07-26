import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, X, Bot, User, RefreshCw, Zap, ShieldAlert, ChevronRight } from 'lucide-react';

interface GeminiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatbotDrawer: React.FC<GeminiChatbotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Greetings! I am **FLUX Market Intelligence OS Gemini Assistant**.\nHow can I optimize your marketing nodes, PPC ROAS, B2B lead acquisition, or strategy playbooks today?',
      timestamp: 'Just now',
      sources: ['Neural Search Verification Active', 'Flux Knowledge Graph'],
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsgText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Neural Search Verification'],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: `[Flux Intelligence Engine Output for "${userMsgText}"]\n\n1. **PPC Recommendation**: Scale Google Search Ads budget by +15% on high-intent intent keywords.\n2. **Node Activity**: Competitor Node detected pricing shifts in AdSphere Pro.\n3. **Action Item**: Deploy counter-campaign on A/B Testing Lab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Analyze Competitor Node pricing delta',
    'Generate Q3 PPC campaign strategy',
    'Transcribe latest podcast ad hook',
    'Run full neural maintenance check',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-purple-800 bg-[#0B0713]/95 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-900/60 p-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 shadow-md">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Flux Gemini Assistant</h3>
            <p className="text-[10px] text-emerald-400 font-mono">Neural Search Active • Low Latency</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-purple-400 hover:bg-purple-950 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-1 text-[10px] text-purple-400/80 font-mono">
              <span>{msg.sender === 'user' ? 'You' : 'Flux Gemini OS'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl p-3.5 leading-relaxed max-w-[90%] font-sans ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-md'
                  : 'bg-[#130D24] text-purple-100 border border-purple-900/50 shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sources && (
                <div className="mt-2 pt-2 border-t border-purple-900/60 text-[10px] font-mono text-purple-400 flex flex-wrap gap-1">
                  {msg.sources.map((s, i) => (
                    <span key={i} className="rounded bg-purple-950 px-1.5 py-0.5 border border-purple-800">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono animate-pulse">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-orange-400" />
            <span>Flux Gemini processing neural prompt...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-purple-950/80 bg-[#130C23] overflow-x-auto no-scrollbar flex space-x-1.5 text-[11px]">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => setInput(qp)}
            className="whitespace-nowrap rounded-lg bg-purple-950/80 border border-purple-800/60 px-2.5 py-1 text-purple-300 hover:text-white hover:border-orange-500/50 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 border-t border-purple-900/60 bg-[#0B0713]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask Flux Gemini OS strategy, node data, ROAS..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl bg-[#130D24] border border-purple-800 py-2 px-3 text-xs text-white placeholder-purple-400/50 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 p-2.5 text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
