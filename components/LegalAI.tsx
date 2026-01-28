
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Scale, ShieldCheck, Download } from 'lucide-react';
import { getLegalAdvice, initAI } from '../services/aiService';
import { Language, User } from '../types';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const LegalAI: React.FC<{ user: User; lang: Language }> = ({ user, lang }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou o Vigilante Pro. O meu processamento é 100% local e privado no seu telemóvel. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, loadProgress]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!user.isPremium) {
      setMessages(prev => [...prev, 
        { role: 'user', text: input },
        { role: 'ai', text: 'Esta funcionalidade (IA Local ilimitada) está reservada a utilizadores Pro.' }
      ]);
      setInput('');
      return;
    }

    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);

    try {
      const response = await getLegalAdvice(userQuery, lang, (p) => setLoadProgress(p));
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setLoadProgress(null);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: `Erro: ${error.message || 'Falha na IA local.'}` }]);
      setLoadProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="font-bold">Apoio Local & Privado</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sem Nuvem • Offline Ready</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {m.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm border dark:border-gray-700 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        
        {loadProgress !== null && (
          <div className="flex flex-col gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span className="flex items-center gap-2"><Download size={14} /> A preparar IA local...</span>
              <span>{loadProgress}%</span>
            </div>
            <div className="model-progress-bar">
              <div className="model-progress-fill" style={{ width: `${loadProgress}%` }}></div>
            </div>
            <p className="text-[9px] text-blue-400 italic">Isto acontece apenas na primeira utilização.</p>
          </div>
        )}

        {isLoading && loadProgress === null && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border dark:border-gray-700 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-xs text-gray-400 italic">IA a pensar localmente...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pb-safe">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-2xl border dark:border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Questão sobre o código..."
            className="flex-1 bg-transparent px-2 py-1 outline-none text-sm dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-xl transition-all ${
              input.trim() && !isLoading ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalAI;
