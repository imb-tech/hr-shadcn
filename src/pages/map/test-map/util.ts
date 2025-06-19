export function getPolygonCentroid(coordinates: number[][][]): {
  x: number;
  y: number;
} {
  const polygon = coordinates[0]; // faqat tashqi ringni olamiz
  let area = 0;
  let x = 0;
  let y = 0;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[j];
    const f = x0 * y1 - x1 * y0;

    area += f;
    x += (x0 + x1) * f;
    y += (y0 + y1) * f;
  }

  area *= 0.5;
  if (area === 0) {
    // fallback: o‘rtacha nuqta
    const total = polygon.reduce(
      (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
      [0, 0],
    );

    return { x: total[0] / polygon.length, y: total[1] / polygon.length };
  }

  x /= 6 * area;
  y /= 6 * area;

  return { x, y };
}

export const polygonColors = [
  "#81E7AF",
  "#6FE6FC",
  "#F2E2B1",
  "#CDC1FF",
  "#B3C8CF",
  "#B6FFA1",
  "#F6EACB",
];


function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Yer radiusi (m)
  const toRad = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // masofa (metrda)
}

// Interpolatsiya qilib nuqtalarni yasash
export function interpolatePoints(
  start: [number, number],
  end: [number, number],
  stepInMeters: number,
) {
  const distance = getDistance(start[1], start[0], end[1], end[0]);
  const numPoints = Math.floor(distance / stepInMeters);

  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    points.push([lng, lat]);
  }

  return points;
}

export function formatArray(array: number[][]) {
  if (!array?.length) {
    return [];
  }
  const step = (array?.length || 0) / 25;

  const result = [];
  for (let i = 0; i < 25; i++) {
    const index = Math.floor(i * step); // Har bir bo'lakning bosh indeksini topish
    result.push(array?.[index]);
  }

  return result;
}
