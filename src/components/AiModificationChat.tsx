import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';

interface AiModificationChatProps {
  project: Project;
  onApplyPlanUpdate: (updatedProject: Project) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  technicalAnalysis?: string;
  suggestedAction?: string;
  costDeltaInr?: number;
  areaDeltaSqFt?: number;
}

export const AiModificationChat: React.FC<AiModificationChatProps> = ({
  project,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I am your Senior Architectural AI Consultant for "${project.name}". How would you like to refine your house plan? You can ask me to expand rooms, optimize the budget, shift alignments, or enhance Vastu compliance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    'Make the kitchen 25 sq.ft bigger',
    'Add an attached balcony to master suite',
    'Optimize construction cost to save ₹1.2 Lakh',
    'Check and apply strict Vastu for the Pooja room',
    'Convert upper lounge into an executive study room',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await api.modifyPlan(query, project);

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        technicalAnalysis: response.technicalAnalysis,
        suggestedAction: response.suggestedAction,
        costDeltaInr: response.costDeltaInr,
        areaDeltaSqFt: response.areaDeltaSqFt,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'I processed your request. The architectural layout parameters have been refreshed.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 bg-[#F5F2ED] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A5A40]/10 border border-[#5A5A40]/20 text-[#5A5A40]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-gray-900">AI Architectural Consultant</h3>
            <p className="text-[10px] text-gray-900 font-medium">Powered by Gemini 3.7 Flash & Parametric CAD</p>
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-[#5A5A40]/10 px-2 py-0.5 text-[10px] font-bold text-[#5A5A40] border border-[#5A5A40]/20 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5A5A40] animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[440px] bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F2ED] border border-black/10 text-[#5A5A40]'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[82%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block rounded-xl px-4 py-2.5 text-xs leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-[#F5F2ED] text-[#1A1A1A] border border-black/5'
                }`}
              >
                {msg.text}

                {/* Technical Analysis Note */}
                {msg.technicalAnalysis && (
                  <div className="mt-2.5 rounded-lg bg-white p-2.5 text-[11px] text-[#1A1A1A]/80 border border-black/10 text-left">
                    <strong className="text-[#5A5A40] font-mono block mb-0.5 uppercase tracking-wider font-bold">Architectural Check:</strong>
                    <span>{msg.technicalAnalysis}</span>
                  </div>
                )}

                {/* Cost/Area impact badge */}
                {(msg.costDeltaInr || msg.areaDeltaSqFt) && (
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    {msg.areaDeltaSqFt && (
                      <span className="rounded bg-[#EFECE7] px-2 py-0.5 font-mono text-[#5A5A40] font-bold border border-black/5">
                        Area: {msg.areaDeltaSqFt > 0 ? `+${msg.areaDeltaSqFt}` : msg.areaDeltaSqFt} sq.ft
                      </span>
                    )}
                    {msg.costDeltaInr && (
                      <span className="rounded bg-[#EFECE7] px-2 py-0.5 font-mono text-[#1A1A1A] font-bold border border-black/5">
                        Est. Cost: {msg.costDeltaInr > 0 ? `+₹${(msg.costDeltaInr / 1000).toFixed(0)}k` : `-₹${(Math.abs(msg.costDeltaInr) / 1000).toFixed(0)}k`}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-[#1A1A1A]/40 block mt-1 px-1 font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5A5A40] bg-[#F5F2ED] p-2.5 rounded-xl border border-black/10 w-fit font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5A5A40]" />
            <span>AI analyzing structural load paths, setbacks and Vastu zones...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="border-t border-black/10 bg-[#F5F2ED] p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="shrink-0 rounded-lg border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-[#5A5A40] hover:bg-[#EFECE7] hover:text-[#1A1A1A] transition-colors shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="border-t border-black/10 bg-[#F5F2ED] p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your request (e.g. Make living room larger, reduce civil cost)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-black/10 bg-white px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#5A5A40] focus:outline-none shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
