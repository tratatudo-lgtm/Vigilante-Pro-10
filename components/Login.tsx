
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  LockKeyhole, 
  Loader2,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { resetPassword } from '../services/auth';

interface LoginProps {
  onToggle: () => void;
  onLogin: (email: string, pass: string) => Promise<void> | void;
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ onToggle, onLogin, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Real-time validation visual states
  const emailValid = email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passValid = password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'auth/user-not-found') setErrorMsg('Utilizador não encontrado.');
      else if (code === 'auth/wrong-password') setErrorMsg('Palavra-passe incorreta.');
      else setErrorMsg('Falha ao entrar. Verifique os seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!emailValid) {
      setErrorMsg("Introduza um email válido primeiro.");
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword(email);
      alert("Link de recuperação enviado!");
    } catch (e) {
      setErrorMsg("Erro ao enviar email de recuperação.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-200">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-md z-10 animate-slide-up">
        
        {/* Main Card */}
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-800/50 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 md:p-12">
          
          {/* Brand & Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-8 transform hover:scale-110 transition-transform duration-500 cursor-pointer">
              <ShieldAlert size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white text-center">
              Bem-vindo
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center font-medium">
              O seu copiloto de trânsito está pronto.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-xs font-bold text-red-600 dark:text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                Identificador (Email)
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.com"
                  className={`w-full pl-14 pr-12 py-5 bg-slate-100/50 dark:bg-slate-800/50 border ${
                    email !== '' ? (emailValid ? 'border-green-500/30' : 'border-red-500/30') : 'border-transparent'
                  } rounded-[1.8rem] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-semibold text-sm`}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  {email !== '' && emailValid && <CheckCircle2 size={18} className="text-green-500" />}
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Chave de Acesso
                </label>
                <button 
                  type="button"
                  onClick={handleForgot}
                  disabled={isResetting}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors uppercase tracking-tight"
                >
                  {isResetting ? 'A processar...' : 'Esqueceu-se?'}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent rounded-[1.8rem] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-semibold text-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.96] disabled:opacity-70 group overflow-hidden relative"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span className="relative z-10">Entrar na Rede</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Ainda não faz parte?
            </p>
            <button 
              onClick={onToggle} 
              className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all uppercase text-[10px] tracking-widest border border-transparent active:scale-95 flex items-center gap-2"
            >
              Criar Conta Gratuita
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Security Footer Badge */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 rounded-2xl">
            <LockKeyhole size={16} className="text-blue-600 dark:text-blue-400" />
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight">
              Segurança em primeiro lugar: Dados encriptados
            </p>
            <ShieldCheck size={16} className="text-green-500" />
          </div>

          <div className="flex items-center gap-6 opacity-20 grayscale dark:invert transition-all hover:opacity-100 hover:grayscale-0">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Vigilante v2.5</span>
            </div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">IA Engine Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
