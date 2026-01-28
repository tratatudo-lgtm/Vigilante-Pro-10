
import { TranslationStrings } from './types';

export const I18N: TranslationStrings = {
  app_name: { pt: 'Vigilante Pro', en: 'Vigilante Pro', es: 'Vigilante Pro' },
  map: { pt: 'Mapa', en: 'Map', es: 'Mapa' },
  legal: { pt: 'IA Local', en: 'Local AI', es: 'IA Local' },
  plans: { pt: 'Premium', en: 'Premium', es: 'Premium' },
  settings: { pt: 'Ajustes', en: 'Settings', es: 'Ajustes' },
  login: { pt: 'Entrar', en: 'Login', es: 'Entrar' },
  register: { pt: 'Registar', en: 'Register', es: 'Registrarse' },
  voice_assistant: { pt: 'Copiloto Local', en: 'Local Co-pilot', es: 'Copiloto Local' },
  radar_warning: { pt: 'Radar próximo! Limite:', en: 'Radar ahead! Limit:', es: '¡Radar cerca! Límite:' },
  accident_warning: { pt: 'Acidente reportado à frente', en: 'Accident reported ahead', es: 'Accidente reportado adelante' },
  rain_warning: { pt: 'Cuidado: Piso escorregadio devido a chuva', en: 'Caution: Slippery road due to rain', es: 'Cuidado: Calzada resbaladiza por lluvia' },
  upgrade_to_premium: { pt: 'Atualizar para Pro', en: 'Upgrade to Pro', es: 'Actualizar a Pro' },
  free_plan: { pt: 'Plano Grátis', en: 'Free Plan', es: 'Plan Gratis' },
  pro_plan: { pt: 'Acesso Vitalício Pro', en: 'Lifetime Pro Access', es: 'Acceso Pro de por Vida' },
  ask_ai: { pt: 'Consulta jurídica privada...', en: 'Private legal consultation...', es: 'Consulta jurídica privada...' },
  report_alert: { pt: 'Reportar Alerta', en: 'Report Alert', es: 'Reportar Alerta' },
};

export const MOCK_RADARS: any[] = [
  { id: '1', lat: 38.7223, lng: -9.1393, type: 'fixed', speedLimit: 80, description: 'A1 - Lisboa' },
  { id: '2', lat: 41.1579, lng: -8.6291, type: 'fixed', speedLimit: 120, description: 'A20 - Porto' },
];

export const STRIPE_PUBLIC_KEY = 'pk_test_sample';
export const OPENROUTE_KEY = '5b3ce3597851110001cf6248e4b4b6f6c2f44a3a8e1f6f3e1b9e9f3e';
