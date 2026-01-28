
import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { resetPassword } from '../services/auth';

interface LoginProps {
  onToggle: () => void;
  onLogin: (email: string, pass: string) => void;
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ onToggle, onLogin, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Por favor, introduza o seu email no campo acima para recuperar a senha.");
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword(email);
      alert("Email de recuperação enviado! Verifique a sua caixa de entrada.");
    } catch (e: any) {
      alert("Erro ao recuperar senha: " + e.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 rotate-3">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <div className="text-left -rotate-2">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">Vigilante</h1>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest leading-none">Pro</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Bem-vindo de volta</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">Inicie sessão para monitorizar a estrada com dados seguros e sincronizados.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Palavra-passe</label>
              <button 
                type="button"
                onClick={handleForgotPassword}
                disabled={isResetting}
                className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:text-blue-800 transition-colors"
              >
                {isResetting ? 'A enviar...' : 'Esqueceu-se da senha?'}
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 group"
            >
              <span>Entrar</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-10 p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100/50">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <RefreshCw size={14} className="text-blue-600" />
          </div>
          <p className="text-[10px] text-blue-800 font-medium leading-normal">
            Segurança em primeiro lugar. Os seus dados são protegidos por autenticação de nível bancário Google Cloud.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-50">
        <p className="text-center text-sm text-gray-500">
          Não tem uma conta? <button onClick={onToggle} className="text-blue-600 font-black hover:text-blue-800 transition-colors">Registe-se aqui</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
