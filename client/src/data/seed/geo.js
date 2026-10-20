/** Fictional Barangay 69, Tondo — dev-only coordinates (not verified survey data). */
export const BARANGAY_BOUNDS = {
  minLng: 120.968,
  maxLng: 120.988,
  minLat: 14.608,
  maxLat: 14.622,
};

export const MAP_CANVAS = { width: 1000, height: 650 };

export function point(lng, lat) {
  return { type: 'Point', coordinates: [lng, lat] };
}

export function lngLatToMapPosition(coordinates) {
  const [lng, lat] = coordinates;
  const { minLng, maxLng, minLat, maxLat } = BARANGAY_BOUNDS;
  return {
    x: ((lng - minLng) / (maxLng - minLng)) * MAP_CANVAS.width,
    y: ((maxLat - lat) / (maxLat - minLat)) * MAP_CANVAS.height,
  };
}
