// Location utilities for buyer product discovery system

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  state?: string;
  lga?: string;
}

export interface NigerianLocation {
  stateId: number;
  stateName: string;
  stateCode: string;
  lgaId?: number;
  lgaName?: string;
}

// Get current location using browser geolocation
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

// Calculate radius for location-based filtering
export function calculateRadius(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = radiusKm / 111.32; // 1 degree latitude ≈ 111.32 km
  const lngDelta = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));

  return {
    minLat: centerLat - latDelta,
    maxLat: centerLat + latDelta,
    minLng: centerLng - lngDelta,
    maxLng: centerLng + lngDelta
  };
}

// Format address for display
export function formatAddress(
  state?: string,
  lga?: string,
  address?: string
): string {
  const parts = [address, lga, state].filter(Boolean);
  return parts.join(', ');
}

// Generate Google Maps directions URL
export function getDirectionsURL(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: 'driving' | 'walking' | 'transit' = 'driving'
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=${mode}`;
}

// Generate Google Maps URL for a location
export function getMapsURL(lat: number, lng: number, zoom: number = 15): string {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
}

// Validate GPS coordinates
export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
}

// Get Nigerian states data
export const NIGERIAN_STATES = [
  { id: 1, name: 'Abia', code: 'AB' },
  { id: 2, name: 'Adamawa', code: 'AD' },
  { id: 3, name: 'Akwa Ibom', code: 'AK' },
  { id: 4, name: 'Anambra', code: 'AN' },
  { id: 5, name: 'Bauchi', code: 'BA' },
  { id: 6, name: 'Bayelsa', code: 'BY' },
  { id: 7, name: 'Benue', code: 'BE' },
  { id: 8, name: 'Borno', code: 'BO' },
  { id: 9, name: 'Cross River', code: 'CR' },
  { id: 10, name: 'Delta', code: 'DE' },
  { id: 11, name: 'Ebonyi', code: 'EB' },
  { id: 12, name: 'Edo', code: 'ED' },
  { id: 13, name: 'Ekiti', code: 'EK' },
  { id: 14, name: 'Enugu', code: 'EN' },
  { id: 15, name: 'Federal Capital Territory', code: 'FC' },
  { id: 16, name: 'Gombe', code: 'GO' },
  { id: 17, name: 'Imo', code: 'IM' },
  { id: 18, name: 'Jigawa', code: 'JI' },
  { id: 19, name: 'Kaduna', code: 'KD' },
  { id: 20, name: 'Kano', code: 'KN' },
  { id: 21, name: 'Katsina', code: 'KT' },
  { id: 22, name: 'Kebbi', code: 'KE' },
  { id: 23, name: 'Kogi', code: 'KO' },
  { id: 24, name: 'Kwara', code: 'KW' },
  { id: 25, name: 'Lagos', code: 'LA' },
  { id: 26, name: 'Nasarawa', code: 'NA' },
  { id: 27, name: 'Niger', code: 'NI' },
  { id: 28, name: 'Ogun', code: 'OG' },
  { id: 29, name: 'Ondo', code: 'ON' },
  { id: 30, name: 'Osun', code: 'OS' },
  { id: 31, name: 'Oyo', code: 'OY' },
  { id: 32, name: 'Plateau', code: 'PL' },
  { id: 33, name: 'Rivers', code: 'RI' },
  { id: 34, name: 'Sokoto', code: 'SO' },
  { id: 35, name: 'Taraba', code: 'TA' },
  { id: 36, name: 'Yobe', code: 'YO' },
  { id: 37, name: 'Zamfara', code: 'ZA' }
] as const;

// Major LGAs for key states
export const MAJOR_LGAS = {
  25: [ // Lagos
    { id: 1, name: 'Alimosho' },
    { id: 2, name: 'Ajeromi-Ifelodun' },
    { id: 3, name: 'Kosofe' },
    { id: 4, name: 'Mushin' },
    { id: 5, name: 'Oshodi-Isolo' },
    { id: 6, name: 'Ojo' },
    { id: 7, name: 'Ikorodu' },
    { id: 8, name: 'Surulere' },
    { id: 9, name: 'Agege' },
    { id: 10, name: 'Ifako-Ijaiye' },
    { id: 11, name: 'Shomolu' },
    { id: 12, name: 'Amuwo-Odofin' },
    { id: 13, name: 'Lagos Mainland' },
    { id: 14, name: 'Ikeja' },
    { id: 15, name: 'Eti-Osa' },
    { id: 16, name: 'Badagry' },
    { id: 17, name: 'Apapa' },
    { id: 18, name: 'Lagos Island' },
    { id: 19, name: 'Epe' },
    { id: 20, name: 'Ibeju-Lekki' }
  ],
  20: [ // Kano
    { id: 21, name: 'Fagge' },
    { id: 22, name: 'Dala' },
    { id: 23, name: 'Gwale' },
    { id: 24, name: 'Tarauni' },
    { id: 25, name: 'Ungogo' },
    { id: 26, name: 'Municipal' },
    { id: 27, name: 'Dawakin Tofa' },
    { id: 28, name: 'Tofa' },
    { id: 29, name: 'Rimin Gado' },
    { id: 30, name: 'Bagwai' },
    { id: 31, name: 'Gezawa' },
    { id: 32, name: 'Gabasawa' },
    { id: 33, name: 'Minjibir' },
    { id: 34, name: 'Dambatta' },
    { id: 35, name: 'Makoda' },
    { id: 36, name: 'Kunchi' },
    { id: 37, name: 'Bichi' },
    { id: 38, name: 'Tsanyawa' },
    { id: 39, name: 'Shanono' },
    { id: 40, name: 'Gwarzo' },
    { id: 41, name: 'Karaye' },
    { id: 42, name: 'Rogo' },
    { id: 43, name: 'Kabo' },
    { id: 44, name: 'Kibiya' },
    { id: 45, name: 'Rano' },
    { id: 46, name: 'Bunkure' },
    { id: 47, name: 'Ajingi' },
    { id: 48, name: 'Albasu' },
    { id: 49, name: 'Gaya' },
    { id: 50, name: 'Takai' },
    { id: 51, name: 'Wudil' },
    { id: 52, name: 'Garko' },
    { id: 53, name: 'Warawa' },
    { id: 54, name: 'Dawakin Kudu' },
    { id: 55, name: 'Kura' },
    { id: 56, name: 'Garun Mallam' },
    { id: 57, name: 'Bebeji' },
    { id: 58, name: 'Kiru' },
    { id: 59, name: 'Sumaila' },
    { id: 60, name: 'Gezawa' },
    { id: 61, name: 'Gabasawa' },
    { id: 62, name: 'Minjibir' },
    { id: 63, name: 'Dambatta' },
    { id: 64, name: 'Makoda' },
    { id: 65, name: 'Kunchi' },
    { id: 66, name: 'Bichi' },
    { id: 67, name: 'Tsanyawa' },
    { id: 68, name: 'Shanono' },
    { id: 69, name: 'Gwarzo' },
    { id: 70, name: 'Karaye' },
    { id: 71, name: 'Rogo' },
    { id: 72, name: 'Kabo' },
    { id: 73, name: 'Kibiya' },
    { id: 74, name: 'Rano' },
    { id: 75, name: 'Bunkure' },
    { id: 76, name: 'Ajingi' },
    { id: 77, name: 'Albasu' },
    { id: 78, name: 'Gaya' },
    { id: 79, name: 'Takai' },
    { id: 80, name: 'Wudil' },
    { id: 81, name: 'Garko' },
    { id: 82, name: 'Warawa' },
    { id: 83, name: 'Dawakin Kudu' },
    { id: 84, name: 'Kura' },
    { id: 85, name: 'Garun Mallam' },
    { id: 86, name: 'Bebeji' },
    { id: 87, name: 'Kiru' },
    { id: 88, name: 'Sumaila' }
  ],
  33: [ // Rivers
    { id: 89, name: 'Port Harcourt' },
    { id: 90, name: 'Okrika' },
    { id: 91, name: 'Ogu/Bolo' },
    { id: 92, name: 'Eleme' },
    { id: 93, name: 'Tai' },
    { id: 94, name: 'Gokana' },
    { id: 95, name: 'Khana' },
    { id: 96, name: 'Oyigbo' },
    { id: 97, name: 'Opobo/Nkoro' },
    { id: 98, name: 'Andoni' },
    { id: 99, name: 'Bonny' },
    { id: 100, name: 'Degema' },
    { id: 101, name: 'Asari-Toru' },
    { id: 102, name: 'Akuku-Toru' },
    { id: 103, name: 'Abua/Odual' },
    { id: 104, name: 'Ahoada West' },
    { id: 105, name: 'Ahoada East' },
    { id: 106, name: 'Ogba/Egbema/Ndoni' },
    { id: 107, name: 'Emohua' },
    { id: 108, name: 'Ikwerre' },
    { id: 109, name: 'Etche' },
    { id: 110, name: 'Omuma' }
  ],
  19: [ // Kaduna
    { id: 111, name: 'Birnin Gwari' },
    { id: 112, name: 'Chikun' },
    { id: 113, name: 'Giwa' },
    { id: 114, name: 'Igabi' },
    { id: 115, name: 'Ikara' },
    { id: 116, name: 'Jaba' },
    { id: 117, name: 'Jema\'a' },
    { id: 118, name: 'Kachia' },
    { id: 119, name: 'Kaduna North' },
    { id: 120, name: 'Kaduna South' },
    { id: 121, name: 'Kagarko' },
    { id: 122, name: 'Kajuru' },
    { id: 123, name: 'Kaura' },
    { id: 124, name: 'Kauru' },
    { id: 125, name: 'Kubau' },
    { id: 126, name: 'Kudan' },
    { id: 127, name: 'Lere' },
    { id: 128, name: 'Makarfi' },
    { id: 129, name: 'Sabon Gari' },
    { id: 130, name: 'Sanga' },
    { id: 131, name: 'Soba' },
    { id: 132, name: 'Zangon Kataf' },
    { id: 133, name: 'Zaria' }
  ],
  31: [ // Oyo
    { id: 134, name: 'Afijio' },
    { id: 135, name: 'Akinyele' },
    { id: 136, name: 'Atiba' },
    { id: 137, name: 'Atisbo' },
    { id: 138, name: 'Egbeda' },
    { id: 139, name: 'Ibadan North' },
    { id: 140, name: 'Ibadan North-East' },
    { id: 141, name: 'Ibadan North-West' },
    { id: 142, name: 'Ibadan South-East' },
    { id: 143, name: 'Ibadan South-West' },
    { id: 144, name: 'Ibarapa Central' },
    { id: 145, name: 'Ibarapa East' },
    { id: 146, name: 'Ibarapa North' },
    { id: 147, name: 'Ido' },
    { id: 148, name: 'Irepo' },
    { id: 149, name: 'Iseyin' },
    { id: 150, name: 'Itesiwaju' },
    { id: 151, name: 'Iwajowa' },
    { id: 152, name: 'Kajola' },
    { id: 153, name: 'Lagelu' },
    { id: 154, name: 'Ogbomosho North' },
    { id: 155, name: 'Ogbomosho South' },
    { id: 156, name: 'Ogo Oluwa' },
    { id: 157, name: 'Olorunsogo' },
    { id: 158, name: 'Oluyole' },
    { id: 159, name: 'Ona Ara' },
    { id: 160, name: 'Orelope' },
    { id: 161, name: 'Ori Ire' },
    { id: 162, name: 'Oyo East' },
    { id: 163, name: 'Oyo West' },
    { id: 164, name: 'Saki East' },
    { id: 165, name: 'Saki West' },
    { id: 166, name: 'Surulere' }
  ]
};

// Get LGAs for a specific state
export function getLGAsForState(stateId: number) {
  return MAJOR_LGAS[stateId as keyof typeof MAJOR_LGAS] || [];
}

// Get state by ID
export function getStateById(stateId: number) {
  return NIGERIAN_STATES.find(state => state.id === stateId);
}

// Get state by code
export function getStateByCode(code: string) {
  return NIGERIAN_STATES.find(state => state.code === code);
}

// Get LGA by ID
export function getLGAById(stateId: number, lgaId: number) {
  const lgas = getLGAsForState(stateId);
  return lgas.find(lga => lga.id === lgaId);
}

// Check if location is within Nigeria (approximate bounds)
export function isWithinNigeria(lat: number, lng: number): boolean {
  return lat >= 4.0 && lat <= 14.0 && lng >= 2.5 && lng <= 14.5;
}

// Get approximate center of Nigeria
export function getNigeriaCenter(): Location {
  return {
    lat: 9.0820,
    lng: 8.6753,
    address: 'Nigeria'
  };
}

// Calculate travel time estimate (rough approximation)
export function estimateTravelTime(distance: number, mode: 'driving' | 'transit' = 'driving'): number {
  const averageSpeed = mode === 'driving' ? 60 : 30; // km/h
  return Math.round((distance / averageSpeed) * 60); // minutes
}

// Format travel time for display
export function formatTravelTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
}
