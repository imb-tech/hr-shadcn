function isPointInPolygon(point: [number, number], vs: [number, number][]) {
  const x = point[0],
    y = point[1];
  let inside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function findPolygonWithOutliers(polygonCoords: [number, number][]) {
  const lons = polygonCoords.map((p) => p[0]);
  const lats = polygonCoords.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const toDegrees = (meters: number) => meters / 111_000;

  const pointsInside: [number, number][] = [];

  while (pointsInside.length < 17) {
    const randomLon = +(minLon + Math.random() * (maxLon - minLon)).toFixed(8);
    const randomLat = +(minLat + Math.random() * (maxLat - minLat)).toFixed(8);

    if (isPointInPolygon([randomLon, randomLat], polygonCoords)) {
      pointsInside.push([randomLon, randomLat]);
    }
  }

  const center = [(minLon + maxLon) / 2, (minLat + maxLat) / 2] as [
    number,
    number,
  ];

  const pointsOutside: [number, number][] = [];
  let attempts = 0;
  const maxAttempts = 100;

  while (pointsOutside.length < 3 && attempts < maxAttempts) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 100 + Math.random() * 5; // 10–15m
    const offsetLon = toDegrees(Math.cos(angle) * distance);
    const offsetLat = toDegrees(Math.sin(angle) * distance);

    const outLon = +(center[0] + offsetLon).toFixed(8);
    const outLat = +(center[1] + offsetLat).toFixed(8);

    const candidate: [number, number] = [outLon, outLat];

    if (!isPointInPolygon(candidate, polygonCoords)) {
      pointsOutside.push(candidate);
    }

    attempts++;
  }

  return [...pointsInside, ...pointsOutside];
}
