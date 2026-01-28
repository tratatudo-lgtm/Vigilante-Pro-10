
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Radar, Alert, User, Language } from '../types';
import { MOCK_RADARS, I18N } from '../constants';
import { Plus, Navigation, List, Route as RouteIcon, X } from 'lucide-react';
import AlertForm from './AlertForm';
import AlertList from './AlertList';
import { getRoute } from '../services/routeService';

// Fix essencial para ícones do Leaflet que desaparecem em builds modernos/ESM
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RadarIcon = L.divIcon({
  html: `<div class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg font-bold text-xs">R</div>`,
  className: '',
  iconSize: [32, 32]
});

const AlertIcon = L.divIcon({
  html: `<div class="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">!</div>`,
  className: '',
  iconSize: [32, 32]
});

const RecenterButton = ({ location }: { location: [number, number] | null }) => {
  const map = useMap();
  const recenter = () => {
    if (location) map.setView(location, 15);
  };
  return (
    <button 
      onClick={recenter}
      className="absolute bottom-4 left-4 z-[1001] bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border dark:border-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
    >
      <Navigation className="text-blue-600" size={20} />
    </button>
  );
};

interface MapScreenProps {
  location: [number, number] | null;
  user: User;
  lang: Language;
}

const MapScreen: React.FC<MapScreenProps> = ({ location, user, lang }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [showList, setShowList] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);

  const t = (key: string) => I18N[key]?.[lang] || key;

  const handleNewAlert = (newAlert: any) => {
    if (location) {
      const alert: Alert = {
        id: Math.random().toString(),
        lat: location[0],
        lng: location[1],
        type: newAlert.type,
        description: newAlert.description,
        timestamp: Date.now(),
        userId: user.id
      };
      setAlerts([...alerts, alert]);
      setShowReport(false);
    }
  };

  const handleRouteRequest = async () => {
    if (!location) return;
    setIsRouting(true);
    // Destino simulado (5km à frente)
    const end: [number, number] = [location[1] + 0.05, location[0] + 0.05];
    const data = await getRoute([location[1], location[0]], end);
    if (data) {
      setRouteData(data);
    }
    setIsRouting(false);
  };

  return (
    <div className="h-full w-full relative map-wrapper bg-gray-200">
      <MapContainer 
        center={location || [38.7223, -9.1393]} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />
        
        {location && (
          <>
            <Marker position={location} />
            <Circle center={location} radius={200} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', opacity: 0.3 }} />
            <RecenterButton location={location} />
          </>
        )}

        {routeData && routeData.features && (
          <Polyline 
            positions={routeData.features[0].geometry.coordinates.map((c: any) => [c[1], c[0]])}
            pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.7 }}
          />
        )}

        {MOCK_RADARS.map((radar: Radar) => (
          <Marker key={radar.id} position={[radar.lat, radar.lng]} icon={RadarIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-600">{t('radar_warning')} {radar.speedLimit} km/h</h3>
                <p className="text-sm">{radar.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {alerts.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={AlertIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-orange-600 capitalize">{alert.type}</h3>
                <p className="text-sm">{alert.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Controlos flutuantes */}
      <div className="absolute top-4 right-4 z-[1001] flex flex-col gap-2">
        <button 
          onClick={() => setShowList(!showList)}
          className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors"
        >
          <List size={20} />
        </button>
        <button 
          onClick={handleRouteRequest}
          disabled={isRouting}
          className={`bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border dark:border-gray-700 text-blue-600 hover:bg-gray-50 transition-colors ${isRouting ? 'opacity-50' : ''}`}
        >
          <RouteIcon size={20} />
        </button>
      </div>

      <button 
        onClick={() => setShowReport(true)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1001] bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all font-semibold whitespace-nowrap"
      >
        <Plus size={20} />
        {t('report_alert')}
      </button>

      {showList && (
        <div className="absolute inset-y-0 right-0 w-80 bg-gray-50 dark:bg-gray-900 z-[2001] shadow-2xl border-l dark:border-gray-700 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
            <h3 className="font-bold">Alertas Recentes</h3>
            <button onClick={() => setShowList(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AlertList alerts={alerts} lang={lang} />
          </div>
        </div>
      )}

      {showReport && (
        <AlertForm 
          onClose={() => setShowReport(false)} 
          onSubmit={handleNewAlert}
          lang={lang}
        />
      )}
    </div>
  );
};

export default MapScreen;
