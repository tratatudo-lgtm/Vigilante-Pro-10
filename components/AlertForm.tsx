
import React, { useState } from 'react';
import { X, AlertTriangle, Car, ShieldAlert, Clock, Send } from 'lucide-react';
import { Language } from '../types';

interface AlertFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  lang: Language;
}

const AlertForm: React.FC<AlertFormProps> = ({ onClose, onSubmit, lang }) => {
  const [type, setType] = useState('accident');
  const [description, setDescription] = useState('');

  const types = [
    { id: 'accident', icon: Car, color: 'bg-red-100 text-red-600', label: { pt: 'Acidente', en: 'Accident', es: 'Accidente' } },
    { id: 'police', icon: ShieldAlert, color: 'bg-blue-100 text-blue-600', label: { pt: 'Op. Stop', en: 'Police', es: 'Policía' } },
    { id: 'hazard', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600', label: { pt: 'Perigo', en: 'Hazard', es: 'Peligro' } },
    { id: 'traffic', icon: Clock, color: 'bg-gray-100 text-gray-600', label: { pt: 'Trânsito', en: 'Traffic', es: 'Tráfico' } },
  ];

  const labels = {
    title: { pt: 'Reportar Alerta', en: 'Report Alert', es: 'Reportar Alerta' },
    desc_placeholder: { pt: 'Descreva o que viu...', en: 'Describe what you saw...', es: 'Describe lo que viste...' },
    submit: { pt: 'Enviar Alerta', en: 'Send Alert', es: 'Enviar Alerta' }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={20} />
            {labels.title[lang]}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-3">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2 ${
                  type === t.id 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-full ${t.color}`}>
                  <t.icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">
                  {t.label[lang]}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={labels.desc_placeholder[lang]}
              className="w-full h-24 p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            onClick={() => onSubmit({ type, description })}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Send size={18} />
            {labels.submit[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertForm;
