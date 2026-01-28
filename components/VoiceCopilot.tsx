
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import { processVoiceCopilot } from '../services/aiService';
import { getWeather } from '../services/weatherService';

interface VoiceCopilotProps {
  location: [number, number] | null;
  isPremium: boolean;
  volume: number;
  autoRead: boolean;
  onVoiceWarning: (text: string) => void;
}

const VoiceCopilot: React.FC<VoiceCopilotProps> = ({ location, isPremium, volume, autoRead, onVoiceWarning }) => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    if (isActive && isPremium && location && autoRead) {
      const now = Date.now();
      if (now - lastUpdate > 300000) { 
        checkRoadConditions();
        setLastUpdate(now);
      }
    }
  }, [location, isActive, isPremium, autoRead]);

  const speak = (text: string) => {
    if (!isActive) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 1.1;
    utterance.volume = volume; // Aplica o volume das definições
    window.speechSynthesis.speak(utterance);
    onVoiceWarning(text);
  };

  const checkRoadConditions = async (manualCommand?: string) => {
    if (!location) return;
    
    try {
      const weather = await getWeather(location[0], location[1]);
      const response = await processVoiceCopilot(
        manualCommand || "resumo segurança",
        { location: `${location[0]},${location[1]}`, weather, alerts: "Radares a 2km" }
      );
      if (response) speak(response);
    } catch (e) {
      console.error("Local AI Error", e);
    }
  };

  const startListening = () => {
    if (!isPremium) {
      speak("Funcionalidade Pro. IA Local requer ativação.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      await checkRoadConditions(transcript);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-[1000]">
      <div className="flex flex-col gap-2 items-end">
        {isListening && (
          <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg text-[10px] font-bold text-red-500 animate-bounce border dark:border-gray-700 uppercase">
            Escuta Local...
          </div>
        )}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
          }`}
        >
          {isActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        
        <button
          onClick={startListening}
          className={`p-4 rounded-2xl shadow-2xl transition-all transform active:scale-90 ${
            isListening ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {isListening ? <Radio size={28} className="animate-pulse" /> : <Mic size={28} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceCopilot;
