
export type Language = 'pt' | 'en' | 'es';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

export interface Radar {
  id: string;
  lat: number;
  lng: number;
  type: 'fixed' | 'mobile' | 'average';
  speedLimit: number;
  description: string;
}

export interface Alert {
  id: string;
  lat: number;
  lng: number;
  type: 'accident' | 'police' | 'hazard' | 'traffic';
  description: string;
  timestamp: number;
  userId: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  isRaining: boolean;
}

export interface TranslationStrings {
  [key: string]: {
    [lang in Language]: string;
  };
}
