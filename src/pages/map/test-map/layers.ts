import type { LayerProps } from "react-map-gl/mapbox";

export const clusterLayer = ({
  source,
  id,
  color,
}: {
  source: string;
  id: string;
  color?: string;
}): LayerProps => {
  return {
    id: "clusters-" + id,
    type: "circle",
    source,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        color,
        100,
        color,
        750,
        color,
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };
};

export const clusterCountLayer = ({
  source,
  id,
}: {
  source: string;
  id: string;
}): LayerProps => {
  return {
    id: "cluster-count-" + id,
    type: "symbol",
    source,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 16,
    },
    paint: {
      "text-color": "#000",
    },
  };
};

export const unclusteredPointLayer = ({
  source,
  id,
  color,
  hoveredFeatureId
}: {
  source: string;
  id: string;
  color?: string;
  hoveredFeatureId: number | null
}): LayerProps => {
  return {
    id: "unclustered-point-" + id,
    type: "circle",
    source,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": color ?? "#11b4da",
      "circle-radius": [
        "case",
        ["==", ["id"], hoveredFeatureId],
        8, // hover bo‘lsa radius 10
        5   // oddiy holatda radius 5
      ],
      "circle-stroke-width": 0.5,
      "circle-stroke-color": "#fff",
      "circle-radius-transition": { duration: 400 },
    },
  };
};

export const unclusteredPointHitboxLayer = ({
  source,
  id,
}: {
  source: string;
  id: string;
}): LayerProps => {
  return {
    id: "unclustered-point-hitbox-" + id,
    type: "circle",
    source,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": 16,
      "circle-color": "#000",
      "circle-opacity": 0,
    },
  };
};


export const polygonFillLayer = (id: string, color: string): LayerProps => ({
  id: `polygon-fill-${id}`,
  type: "fill",
  source: `polygon-source-${id}`,
  paint: {
    "fill-color": color,
    "fill-opacity": 0.04,
  },
});

export const polygonLineLayer = (id: string, color: string): LayerProps => ({
  id: `polygon-line-${id}`,
  type: "line",
  source: `polygon-source-${id}`,
  paint: {
    "line-color": color,
    "line-width": 2,
    "line-opacity": 0.6,
  },
});
