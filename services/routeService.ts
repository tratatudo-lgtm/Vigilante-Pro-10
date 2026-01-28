
import { OPENROUTE_KEY } from '../constants';

export const getRoute = async (start: [number, number], end: [number, number]) => {
  try {
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Authorization': OPENROUTE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates: [start, end] }),
    });
    if (!response.ok) throw new Error('Failed to fetch route');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
