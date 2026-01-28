
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, ShieldAlert, ArrowRight, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';

interface RegisterProps {
  onToggle: () => void;
  onRegister: (name: string, email: string, pass: string) => Promise<void> | void;
  lang: Language;
}

const Register: React.FC<RegisterProps> = ({ onToggle, onRegister, lang }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validation States
  const [validations, setValidations] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false
  });

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 8;
    const doPasswordsMatch = password === confirmPassword && password !== '';
    const isNameValid = name.trim().length >= 3;

    setValidations({
      name: isNameValid,
      email: isEmailValid,
      password: isPasswordValid,
      confirm: doPasswordsMatch
    });
  }, [name, email, password, confirmPassword]);

  const isFormValid = Object.values(validations).every(v => v === true);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMsg(null);
    setIsLoading(true);
    try {
      await onRegister(name, email, password);
    } catch (err: any) {
      // Friendly error translation
      let msg = "Erro ao criar conta. Tente novamente.";
      if (err.code === 'auth/email-already-in-use') msg = "Este email já está associado a uma conta.";
      if (err.code === 'auth/invalid-email') msg = "O email introduzido não é válido.";
      if (err.code === 'auth/operation-not-allowed') msg = "O registo com email/senha não está ativado.";
      if (err.code === 'auth/weak-password') msg = "A palavra-passe é demasiado fraca.";
      
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationIcon = ({ isValid, value }: { isValid: boolean, value: string }) => {
    if (value === '') return null;
    return isValid 
      ? <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in duration-300" /> 
      : <AlertCircle size={18} className="text-red-500 animate-in zoom-in duration-300" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] shadow-2xl p-8 md:p-10">
          
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500">
              <ShieldAlert size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter text-slate-900 dark:text-white">Criar Conta</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">Junte-se à maior rede de segurança rodoviária.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${name !== '' && !validations.name ? 'border-red-500/30' : 'border-slate-200 dark:border-slate-700'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white font-medium text-sm`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon isValid={validations.name} value={name} />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ola@vigilante.pt"
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${email !== '' && !validations.email ? 'border-red-500/30' : 'border-slate-200 dark:border-slate-700'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white font-medium text-sm`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon isValid={validations.email} value={email} />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Palavra-passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${password !== '' && !validations.password ? 'border-red-500/30' : 'border-slate-200 dark:border-slate-700'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white font-medium text-sm`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-11 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon isValid={validations.password} value={password} />
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirmar Palavra-passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${confirmPassword !== '' && !validations.confirm ? 'border-red-500/30' : 'border-slate-200 dark:border-slate-700'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white font-medium text-sm`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon isValid={validations.confirm} value={confirmPassword} />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed ${
                  isFormValid && !isLoading 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    <span>Registar no Vigilante</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-8 px-4 font-bold uppercase tracking-tight">
            Ao registar-se, os seus alertas serão encriptados e guardados na Cloud para acesso multiplataforma.
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 mb-4 font-medium">
          Já tem conta? 
          <button 
            onClick={onToggle} 
            className="ml-2 text-blue-600 dark:text-blue-400 font-black hover:underline uppercase text-xs tracking-widest"
          >
            Inicie sessão
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
