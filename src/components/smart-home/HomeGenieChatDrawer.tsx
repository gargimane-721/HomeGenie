import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Wrench,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Home } from '../../types';
import { api } from '../../services/api';

interface HomeGenieChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentHome: Home | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: string[];
  createdAt: string;
}

const QUICK_PROMPTS = [
  'Which appliances need attention or servicing soon?',
  'Are any of my appliance warranties expiring?',
  'How can I optimize solar energy consumption for my heavy appliances?',
  'Give me preventive care tips for my inverter AC.',
];

export const HomeGenieChatDrawer: React.FC<HomeGenieChatDrawerProps> = ({
  isOpen,
  onClose,
  currentHome,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello! I am **Home Genie AI**, your smart home and appliance operations copilot. I am actively connected to **${
        currentHome?.name || 'your residence'
      }**.\n\nI can help you monitor appliance health, preventive maintenance schedules, warranty expirations, and solar energy efficiency.`,
      suggestedActions: [
        'Check Appliance Health',
        'Upcoming Maintenance',
        'Warranty Expiry Status',
      ],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.sendHomeGenieMessage({
        message: text,
        home_id: currentHome?.id,
      });

      const assistantMsg: Message = {
        id: response.messageId || `bot_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        suggestedActions: response.suggestedActions,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content:
            'I encountered an issue retrieving your home data. Please check your connection and try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header matching Website CSS */}
        <div className="p-6 sm:p-7 border-b border-gray-200 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-gray-900 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-heading text-lg font-bold text-gray-900">Home Genie Assistant</h3>
                <span className="rounded-lg bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-900 border border-gray-300">
                  AI Live
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-0.5">{currentHome?.name || 'Palm Meadows Villa'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-gray-700 hover:text-black hover:bg-gray-100 transition border border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5 bg-gray-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 text-xs sm:text-sm leading-relaxed font-normal shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white rounded-tr-sm font-medium'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Action suggestions pills */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 max-w-[85%]">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-wider shadow-sm transition"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-white border border-gray-200 w-fit shadow-sm">
              <Sparkles className="w-4 h-4 text-gray-900 animate-spin" />
              <span className="text-xs text-gray-700 font-bold">Consulting home intelligence model...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-4 bg-white border-t border-gray-200 overflow-x-auto flex gap-2.5 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-4 py-2 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-5 sm:p-6 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask about appliances, warranty dates, energy..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest shadow-sm transition flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
