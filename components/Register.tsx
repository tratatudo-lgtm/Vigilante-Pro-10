
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface RegisterProps {
  onToggle: () => void;
  onRegister: (name: string, email: string, pass: string) => void;
  lang: Language;
}

const Register: React.FC<RegisterProps> = ({ onToggle, onRegister, lang }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 animate-in slide-in-from-right duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-6">
            <ShieldAlert size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Criar Conta Cloud</h2>
          <p className="text-gray-500 text-sm">Sincronize os seus alertas em qualquer dispositivo.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ola@exemplo.pt"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Registar no Firebase
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 px-4">
          Ao registar-se, os seus dados serão guardados de forma segura na Google Cloud.
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8 mb-4">
        Já tem uma conta? <button onClick={onToggle} className="text-blue-600 font-bold hover:underline">Entre aqui</button>
      </p>
    </div>
  );
};

export default Register;
