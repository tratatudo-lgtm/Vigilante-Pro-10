
export const getWeather = async (lat: number, lng: number) => {
  // Simulating weather API call for the purpose of the demo
  // In production: fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=API_KEY`)
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    temp: 22,
    condition,
    isRaining: condition === 'Rainy' || condition === 'Stormy',
  };
};
