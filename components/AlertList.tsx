
import React from 'react';
import { AlertCircle, Clock, MapPin, ShieldAlert, Car, AlertTriangle } from 'lucide-react';
import { Alert, Language } from '../types';

interface AlertListProps {
  alerts: Alert[];
  lang: Language;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, lang }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'accident': return <Car className="text-red-500" />;
      case 'police': return <ShieldAlert className="text-blue-500" />;
      case 'hazard': return <AlertTriangle className="text-orange-500" />;
      default: return <AlertCircle className="text-gray-500" />;
    }
  };

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString(lang === 'pt' ? 'pt-PT' : lang === 'es' ? 'es-ES' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center opacity-50">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-medium">Nenhum alerta recente nesta zona.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {alerts.sort((a, b) => b.timestamp - a.timestamp).map((alert) => (
        <div key={alert.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm flex gap-4 items-start transition-all hover:shadow-md">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
            {getIcon(alert.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-sm capitalize">{alert.type}</h4>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Clock size={12} />
                {formatTime(alert.timestamp)}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
              {alert.description || "Sem descrição adicional."}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
              <MapPin size={10} />
              {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertList;
