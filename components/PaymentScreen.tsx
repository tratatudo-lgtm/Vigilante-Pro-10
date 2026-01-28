
import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Star, Sparkles, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { User, Language } from '../types';
import { api } from '../services/api';

interface PaymentScreenProps {
  user: User;
  setUser: (u: User) => void;
  lang: Language;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ user, setUser, lang }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // No Vercel, isso chamaria uma Serverless Function que cria a sessão no Stripe
      const session = await api.createStripeSession(user.id);
      
      // Simulação de redirecionamento e retorno de sucesso
      setTimeout(() => {
        setUser({ ...user, isPremium: true });
        localStorage.setItem('vigilante_session', JSON.stringify({ ...user, isPremium: true }));
        setLoading(false);
      }, 1500);
    } catch (e) {
      setLoading(false);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  const features = [
    { icon: Zap, text: { pt: 'IA de Copiloto (Voz)', en: 'Voice Copilot AI', es: 'IA de copiloto (Voz)' } },
    { icon: ShieldCheck, text: { pt: 'Apoio Jurídico Ilimitado', en: 'Unlimited Legal Support', es: 'Apoyo legal ilimitado' } },
    { icon: Star, text: { pt: 'Alertas de Operação Stop', en: 'Police Check Alerts', es: 'Alertas de control policial' } },
    { icon: Sparkles, text: { pt: 'Sem Publicidade', en: 'Ad Free', es: 'Sin Publicidad' } },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-20">
      <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tighter">Vigilante Pro</h2>
          <p className="text-blue-100 text-sm opacity-90">Acesso vitalício à inteligência de estrada.</p>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
          <ShieldCheck size={200} />
        </div>
      </div>

      <div className="p-6 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-yellow-400/30 overflow-hidden">
          <div className="p-6 bg-yellow-400/5 flex justify-between items-center border-b dark:border-gray-700">
             <div>
               <h3 className="font-black text-xl text-gray-900 dark:text-white">Plano Vitalício</h3>
               <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Paga uma vez, usa sempre</p>
             </div>
             <div className="text-right">
               <span className="text-3xl font-black text-blue-600">29.99€</span>
             </div>
          </div>

          <div className="p-6 space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <f.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm dark:text-gray-200">{f.text[lang]}</p>
                </div>
                <Check className="text-green-500" size={18} />
              </div>
            ))}
          </div>

          <div className="p-6 pt-0">
            <button
              onClick={handleUpgrade}
              disabled={user.isPremium || loading}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                user.isPremium 
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : user.isPremium ? (
                <>Premium Ativado <ShieldCheck size={24} /></>
              ) : (
                <>Ativar Agora <ArrowRight size={24} /></>
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-4 grayscale opacity-40">
               <CreditCard size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout via Stripe</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
           <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">Porquê o Pro?</h4>
           <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
             O Vigilante Pro utiliza modelos de IA avançados (Gemini 2.5/3) para processar trânsito em tempo real, 
             oferecendo-lhe uma camada de proteção jurídica e avisos de voz que não existem na versão gratuita.
           </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
