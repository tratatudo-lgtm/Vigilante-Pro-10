
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Map as MapIcon, ShieldAlert, MessageSquare, CreditCard, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { getUserProfile } from "./services/auth";
import { Language, User, Theme } from './types';
import { I18N } from './constants';
import { loginUser, registerUser, logoutUser } from './services/auth';

// Components
import MapScreen from './components/MapScreen';
import LegalAI from './components/LegalAI';
import Settings from './components/Settings';
import PaymentScreen from './components/PaymentScreen';
import Login from './components/Login';
import Register from './components/Register';
import VoiceCopilot from './components/VoiceCopilot';

const App = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Settings States
  const [lang, setLang] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('light');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [speedThreshold, setSpeedThreshold] = useState(5);
  const [alertDistance, setAlertDistance] = useState(1000);
  const [units, setUnits] = useState<'kmh' | 'mph'>('kmh');
  const [autoReadAlerts, setAutoReadAlerts] = useState(true);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          }
        } catch (e) {
          console.error("Erro ao carregar perfil do Firestore", e);
        }
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('vigilante_settings');
    if (savedSettings) {
      const s = JSON.parse(savedSettings);
      if (s.speedThreshold) setSpeedThreshold(s.speedThreshold);
      if (s.alertDistance) setAlertDistance(s.alertDistance);
      if (s.units) setUnits(s.units);
      if (s.voiceVolume) setVoiceVolume(s.voiceVolume);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("Location error:", err)
      );
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("Watch location error:", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vigilante_settings', JSON.stringify({
      speedThreshold, alertDistance, units, voiceVolume, autoReadAlerts
    }));
  }, [speedThreshold, alertDistance, units, voiceVolume, autoReadAlerts]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      await loginUser(email, pass);
    } catch (e: any) {
      alert("Erro no Login: " + e.message);
    }
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    try {
      await registerUser(name, email, pass);
    } catch (e: any) {
      alert("Erro no Registo: " + e.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const t = (key: string) => I18N[key]?.[lang] || key;

  if (isAuthLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-blue-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs font-mono">Autenticando...</p>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} onRegister={(u: any) => handleRegister(u.name, u.email, u.password)} lang={lang} />
    ) : (
      <Login onToggle={() => setShowRegister(true)} onLogin={(u: any) => handleLogin(u.email, u.password)} lang={lang} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'map': return <MapScreen location={location} user={user} lang={lang} />;
      case 'legal': return <LegalAI user={user} lang={lang} />;
      case 'plans': return <PaymentScreen user={user} setUser={setUser} lang={lang} />;
      case 'settings': return (
        <Settings 
          user={user} 
          setUser={setUser}
          lang={lang} 
          setLang={setLang} 
          theme={theme} 
          setTheme={setTheme} 
          isVoiceActive={isVoiceActive}
          setIsVoiceActive={setIsVoiceActive}
          voiceVolume={voiceVolume}
          setVoiceVolume={setVoiceVolume}
          speedThreshold={speedThreshold}
          setSpeedThreshold={setSpeedThreshold}
          alertDistance={alertDistance}
          setAlertDistance={setAlertDistance}
          units={units}
          setUnits={setUnits}
          autoReadAlerts={autoReadAlerts}
          setAutoReadAlerts={setAutoReadAlerts}
          onLogout={handleLogout}
        />
      );
      default: return <MapScreen location={location} user={user} lang={lang} />;
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="flex-none p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center z-[2000] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t('app_name')}</h1>
        </div>
        {user.isPremium && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-lg border border-green-300 shadow-sm uppercase tracking-tighter">
            LOCAL AI ACTIVE
          </div>
        )}
      </header>

      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
        <VoiceCopilot 
          location={location} 
          isPremium={user.isPremium} 
          volume={voiceVolume}
          autoRead={autoReadAlerts}
          onVoiceWarning={(text) => console.debug('Voice Info:', text)} 
        />
      </main>

      <nav className="flex-none bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-2 flex justify-around items-center z-[2000] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'map' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MapIcon size={24} className={activeTab === 'map' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{t('map')}</span>
        </button>
        <button onClick={() => setActiveTab('legal')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'legal' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MessageSquare size={24} className={activeTab === 'legal' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{t('legal')}</span>
        </button>
        <button onClick={() => setActiveTab('plans')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'plans' ? 'text-blue-600' : 'text-gray-400'}`}>
          <CreditCard size={24} className={activeTab === 'plans' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{t('plans')}</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}>
          <SettingsIcon size={24} className={activeTab === 'settings' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{t('settings')}</span>
        </button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
