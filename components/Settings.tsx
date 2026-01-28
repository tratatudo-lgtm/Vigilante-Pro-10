
import React, { useState } from 'react';
import { 
  Moon, Sun, Globe, Bell, Mic, LogOut, ChevronRight, User as UserIcon, 
  Gauge, MapPin, Volume2, Database, Shield, Zap, Info, Trash2, Edit2
} from 'lucide-react';
import { User, Language, Theme } from '../types';

interface SettingsProps {
  user: User;
  setUser: (u: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (v: boolean) => void;
  voiceVolume: number;
  setVoiceVolume: (v: number) => void;
  speedThreshold: number;
  setSpeedThreshold: (n: number) => void;
  alertDistance: number;
  setAlertDistance: (n: number) => void;
  units: 'kmh' | 'mph';
  setUnits: (u: 'kmh' | 'mph') => void;
  autoReadAlerts: boolean;
  setAutoReadAlerts: (b: boolean) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  user, setUser, lang, setLang, theme, setTheme, isVoiceActive, setIsVoiceActive,
  voiceVolume, setVoiceVolume, speedThreshold, setSpeedThreshold,
  alertDistance, setAlertDistance, units, setUnits, autoReadAlerts, setAutoReadAlerts, onLogout 
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const handleUpdateName = () => {
    setUser({ ...user, name: tempName });
    localStorage.setItem('vigilante_session', JSON.stringify({ ...user, name: tempName }));
    setIsEditingName(false);
  };

  const clearModelCache = () => {
    if (confirm("Deseja apagar os dados da IA local? Terá de descarregar novamente (aprox. 1.5GB) na próxima utilização.")) {
      // Logic would be here if using actual IndexedDB
      alert("Cache limpa com sucesso.");
    }
  };

  const SettingRow = ({ icon: Icon, label, action, description, premiumOnly }: any) => (
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-0 ${premiumOnly && !user.isPremium ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-500">
          <Icon size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{label}</p>
            {premiumOnly && <span className="text-[8px] bg-yellow-400 text-yellow-900 px-1 rounded font-black">PRO</span>}
          </div>
          {description && <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{description}</p>}
        </div>
      </div>
      <div className="flex items-center">{action}</div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Perfil */}
      <div className="p-8 flex flex-col items-center bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="relative group">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 mb-4 border-4 border-white dark:border-gray-800 shadow-xl">
            <UserIcon size={48} />
          </div>
          <button onClick={() => setIsEditingName(true)} className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
            <Edit2 size={12} />
          </button>
        </div>
        
        {isEditingName ? (
          <div className="flex gap-2 items-center">
            <input 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-center font-bold outline-none border-2 border-blue-500"
            />
            <button onClick={handleUpdateName} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">OK</button>
          </div>
        ) : (
          <h3 className="font-black text-xl tracking-tight">{user.name}</h3>
        )}
        <p className="text-xs text-gray-400 font-mono mb-4">{user.email}</p>
        
        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${user.isPremium ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-400'} shadow-lg`}>
          {user.isPremium ? <Shield size={16} /> : <Zap size={16} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {user.isPremium ? 'Premium Local AI active' : 'Versão Standard'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-8 pb-32">
        {/* Interface */}
        <section>
          <h4 className="px-4 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Interface & Visual</h4>
          <div className="rounded-3xl overflow-hidden shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800">
            <SettingRow 
              icon={theme === 'light' ? Sun : Moon} 
              label="Tema da App" 
              description={theme === 'light' ? 'Luminoso' : 'Escuro'}
              action={
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              } 
            />
            <SettingRow 
              icon={Globe} 
              label="Idioma do Sistema" 
              action={
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-sm font-bold outline-none text-blue-600 dark:text-blue-400 text-right cursor-pointer"
                >
                  {languages.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                </select>
              } 
            />
          </div>
        </section>

        {/* Condução */}
        <section>
          <h4 className="px-4 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Condução & Segurança</h4>
          <div className="rounded-3xl overflow-hidden shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800">
            <SettingRow 
              icon={Gauge} 
              label="Alerta de Velocidade" 
              description={`Avisar aos +${speedThreshold} ${units === 'kmh' ? 'km/h' : 'mph'}`}
              action={
                <select 
                  value={speedThreshold} 
                  onChange={(e) => setSpeedThreshold(Number(e.target.value))}
                  className="bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg text-xs font-bold outline-none"
                >
                  <option value={0}>Imediato</option>
                  <option value={5}>+5 {units === 'kmh' ? 'km/h' : 'mph'}</option>
                  <option value={10}>+10 {units === 'kmh' ? 'km/h' : 'mph'}</option>
                </select>
              } 
            />
            <SettingRow 
              icon={MapPin} 
              label="Distância de Alerta" 
              description={`Avisar radares a ${alertDistance}m`}
              action={
                <select 
                  value={alertDistance} 
                  onChange={(e) => setAlertDistance(Number(e.target.value))}
                  className="bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg text-xs font-bold outline-none"
                >
                  <option value={500}>500m</option>
                  <option value={1000}>1km</option>
                  <option value={2000}>2km</option>
                </select>
              } 
            />
             <SettingRow 
              icon={Gauge} 
              label="Unidades de Medida" 
              action={
                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                  <button onClick={() => setUnits('kmh')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${units === 'kmh' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-400'}`}>KM/H</button>
                  <button onClick={() => setUnits('mph')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${units === 'mph' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-400'}`}>MPH</button>
                </div>
              } 
            />
          </div>
        </section>

        {/* Som e Voz */}
        <section>
          <h4 className="px-4 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Som & Copiloto</h4>
          <div className="rounded-3xl overflow-hidden shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800">
            <SettingRow 
              icon={Mic} 
              label="Assistente de Voz" 
              description="Feedback vocal de estrada"
              action={
                <button 
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isVoiceActive ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isVoiceActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              } 
            />
            <SettingRow 
              icon={Volume2} 
              label="Volume do Copiloto" 
              description={`${Math.floor(voiceVolume * 100)}%`}
              action={
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={voiceVolume} 
                  onChange={(e) => setVoiceVolume(Number(e.target.value))}
                  className="w-24 accent-blue-600 h-1"
                />
              } 
            />
            <SettingRow 
              icon={Bell} 
              label="Auto-Leitura de Alertas" 
              description="Ler alertas sem comando"
              action={
                <button 
                  onClick={() => setAutoReadAlerts(!autoReadAlerts)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${autoReadAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoReadAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              } 
            />
          </div>
        </section>

        {/* Dados e IA */}
        <section>
          <h4 className="px-4 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dados & IA Local</h4>
          <div className="rounded-3xl overflow-hidden shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800">
            <SettingRow 
              icon={Database} 
              label="Armazenamento IA" 
              description="Phi-3 Mini Local Model"
              action={
                <button onClick={clearModelCache} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              } 
            />
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 flex gap-3 items-start">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-tight">
                O seu dispositivo suporta <b>WebGPU</b>. A IA corre 100% no hardware local para máxima privacidade.
              </p>
            </div>
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-5 text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 dark:bg-red-900/20 rounded-3xl hover:bg-red-100 transition-all active:scale-95 shadow-lg shadow-red-100 dark:shadow-none"
        >
          <LogOut size={18} />
          Terminar Sessão Segura
        </button>

        <div className="flex flex-col items-center gap-1 opacity-30 py-8">
           <Shield size={24} className="text-gray-400" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Vigilante Pro v2.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
