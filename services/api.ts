
import { Alert, User } from '../types';

/**
 * Este serviço centraliza as chamadas que no Vercel seriam rotas em /api
 * Facilitando a manutenção e segurança.
 */

const API_BASE = '/api'; // Placeholder para Vercel Functions

export const api = {
  // Simulação de busca de radares reais (Vercel filtraria por localização no server-side)
  fetchRadars: async (lat: number, lng: number) => {
    // Em produção: return fetch(`${API_BASE}/radars?lat=${lat}&lng=${lng}`).then(r => r.json());
    return [
      { id: 'r1', lat: 38.7223, lng: -9.1393, type: 'fixed', speedLimit: 80, description: 'Radar fixo A1 Sul-Norte' },
      { id: 'r2', lat: 41.1579, lng: -8.6291, type: 'fixed', speedLimit: 120, description: 'Radar VCI Porto' }
    ];
  },

  // Reportar alerta para o backend Vercel
  reportAlert: async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    console.debug("Vercel API: Persistindo alerta no banco de dados...", alert);
    return {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
  },

  // Iniciar Checkout Stripe
  createStripeSession: async (userId: string) => {
    console.debug("Vercel API: Criando sessão de checkout Stripe para o utilizador", userId);
    // Simula o redirecionamento para o Stripe
    return { url: 'https://checkout.stripe.com/pay/sample_session' };
  }
};
