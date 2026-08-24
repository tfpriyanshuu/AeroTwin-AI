export function formatScientificNotation(numStr: string | number): string {
  if (typeof numStr === 'string') return numStr;
  return numStr.toExponential(2);
}

export function formatNumberWithCommas(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

export function getWindCompassDirection(degrees: number): string {
  const sectors = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return sectors[index];
}
