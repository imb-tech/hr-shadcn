import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    FullscreenControl,
    Layer,
    Map,
    Marker,
    NavigationControl,
    ScaleControl,
    Source,
} from "react-map-gl/mapbox"
import {
    clusterCountLayer,
    clusterLayer,
    polygonFillLayer,
    polygonLineLayer,
    unclusteredPointHitboxLayer,
    unclusteredPointLayer,
} from "./layers"

import { ROTUES } from "@/constants/api-endpoints"
import { MAPBOX_TOKEN } from "@/constants/map"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { ArrowLeft } from "lucide-react"
import type { GeoJSONSource, MapMouseEvent } from "mapbox-gl"
import type { MapRef } from "react-map-gl/mapbox"
import { CustomPopup } from "./custom-popup"
import { MapStyleSwitcher } from "./map-swticher"
import OfficeTooltip from "./office-tooltip"
import { formatArray, getPolygonCentroid, polygonColors } from "./util"
import { useTheme } from "@/layouts/theme"
import { toast } from "sonner"

type TPoint = {
    latitude: number
    longitude: number
}

type Props = {
    defaultZoom?: number
    defaultCenter?: TPoint
    points?: GeoJSON.GeoJSON[]
    polygons?: GeoJSON.FeatureCollection[]
}

// ForwardRef bilan wrapper
const TestMap = forwardRef<MapRef, Props>(function TestMapComponent(
    { defaultZoom = 14, defaultCenter, points, polygons }: Props,
    ref,
) {
    const internalMapRef = useRef<MapRef | null>(null)
    const { theme } = useTheme()
    const [isLoaded, setIsLoaded] = useState(false)
    const [route, setRoute] = useState<GeoJSON.FeatureCollection | null>(null)
    const [mapStyleId, setMapStyleId] = useState(
        theme === "dark" ? "dark-v11" : "light-v11",
    )

    const navigate = useNavigate()
    const search = useSearch({ from: "__root__" })
    const { route_id: route_id_param, id } = search

    const route_id = useMemo(() => route_id_param, [route_id_param])

    const { data: routes } = useGet<
        Array<{
            created_at: string
            lat: number
            lng: number
        }>
    >(`${ROTUES}/${route_id}`, {
        options: { enabled: !!route_id },
    })

    const [activePopup, setActivePopup] = useState<{
        lngLat: [number, number]
        properties: any
    } | null>(null)

    useImperativeHandle(ref, () => internalMapRef.current as MapRef, [
        internalMapRef.current,
    ])

    const onClick = (event: MapMouseEvent) => {
        const feature = event.features?.[0]

        if (!feature) return

        const { cluster_id } = feature.properties || {}

        const coordinates =
            feature.geometry.type === "Point" ?
                (feature.geometry.coordinates as [number, number])
            :   (event.lngLat.toArray() as [number, number])

        if (cluster_id) {
            const mapboxSource = internalMapRef.current?.getSource(
                "earthquakes",
            ) as GeoJSONSource

            mapboxSource.getClusterExpansionZoom(cluster_id, (err, zoom) => {
                if (err) return

                internalMapRef.current?.easeTo({
                    center: coordinates,
                    zoom: zoom ?? defaultZoom,
                    duration: 500,
                })
            })
        } else if (
            feature.geometry.type === "Point" &&
            internalMapRef?.current
        ) {
            const coordinates = feature.geometry.coordinates as [number, number]

            navigate({
                to: "/map",
                search: {
                    ...search,
                    id: feature?.id?.toString(),
                },
            })

            setActivePopup({
                lngLat: coordinates,
                properties: feature.properties,
            })
        }
    }

    const start: [number, number] = useMemo(() => {
        if (routes?.length) {
            return [routes[0].lng, routes[0].lat]
        } else return [0, 0]
    }, [routes])

    const end: [number, number] = useMemo(() => {
        const len = routes?.length
        if (len) {
            return [routes[len - 1].lng, routes[len - 1].lat]
        } else return [0, 0]
    }, [routes])

    const history = useMemo(() => {
        if (!route_id) {
            return null
        }
        if (Array.isArray(routes) && !routes?.length && route_id) {
            toast.warning("Bu sanada ma'lumot yo'q")
        }
        const r = routes?.map((cord) => [cord.lng, cord.lat]) ?? []
        return formatArray(r).join(";")
    }, [route_id, routes])

    const url = useMemo(
        () =>
            history ?
                `https://api.mapbox.com/directions/v5/mapbox/walking/${history}?overview=full&steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
            :   "",
        [history],
    )

    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(
        null,
    )

    const onMouseMove = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
        const feature = event.features?.[0]
        if (feature && feature.id !== undefined) {
            setHoveredFeatureId(feature.id as number)
        } else {
            setHoveredFeatureId(null)
        }
    }, [])

    useEffect(() => {
        if (url && route_id) {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (internalMapRef?.current) {
                        internalMapRef?.current.flyTo({
                            center: end,
                            duration: 1000,
                            curve: 1.42,
                            zoom: 14.6,
                        })
                    }
                    setRoute({
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                properties: {},
                                geometry: data.routes[0]?.geometry,
                            },
                        ],
                    })
                })
        }
    }, [url, route_id])

    useEffect(() => {
        if (id && points) {
            const allFeatures = points?.flatMap((d: any) => d.features || [])

            const usr = allFeatures.find((us) => us.id == Number(id))

            if (usr) {
                setActivePopup({
                    lngLat: usr.geometry.coordinates,
                    properties: usr.properties,
                })
            } else {
                setActivePopup(null)
            }
        } else {
            setActivePopup(null)
        }
    }, [id, points])

    useEffect(() => {
        if (isLoaded && internalMapRef.current) {
            const geolocateControl = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            })

            internalMapRef.current.addControl(geolocateControl)
            geolocateControl.trigger()

            return () => {
                internalMapRef.current?.removeControl(geolocateControl)
            }
        }
    }, [isLoaded, route_id])

    return (
        <Map
            ref={internalMapRef}
            performanceMetricsCollection
            initialViewState={{
                latitude: defaultCenter?.latitude ?? 41.20066,
                longitude: defaultCenter?.longitude ?? 69.236537,
                zoom: defaultZoom,
            }}
            onMouseMove={onMouseMove}
            interactiveLayerIds={[
                ...(points
                    ?.map((_, i) => [
                        `unclustered-point-${i}`,
                        `unclustered-point-hitbox-${i}`,
                        `cluster-${i}`,
                        `cluster-count-${i}`,
                    ])
                    ?.flat() ?? []),
            ]}
            language="uz-UZ"
            mapStyle={`mapbox://styles/mapbox/${mapStyleId}`}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ borderRadius: "10px" }}
            onClick={onClick}
            onLoad={() => setIsLoaded(true)}
        >
            <NavigationControl position="top-right" />
            <FullscreenControl />
            <ScaleControl position="bottom-right" />
            <MapStyleSwitcher
                initial={theme === "dark" ? "dark-v11" : "light-v11"}
                onChange={(id) => setMapStyleId(id)}
            />

            {/* {route_id && (
                <div className="flex justify-end pr-12 pt-2 gap-2">
                    <Button
                        isIconOnly
                        variant="faded"
                        onPress={() => {
                            setDate(systemDate)
                            navigate({
                                to: window.location.pathname,
                                search: {
                                    id: route_id.toString(),
                                },
                            })
                        }}
                    >
                        <ArrowLeft />
                    </Button>
                    <DatePickee
                        className="max-w-[200px] bg-default-200"
                        value={date as any}
                        onChange={setDate as any}
                        variant="faded"
                        aria-label="sana tanlagich"
                    />
                </div>
            )} */}

            {route && route_id && (
                <Source id="history" type="geojson" data={route}>
                    <Layer
                        id="line-layer"
                        type="line"
                        source="history"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round",
                        }}
                        paint={{
                            "line-color": "hsl(226, 65%, 52%)",
                            "line-width": 3,
                            "line-opacity": 1,
                            "line-dasharray": [
                                "step",
                                ["zoom"],
                                [1, 0], // 1-qiymat: zoom 0 dan boshlab
                                14, // 14 zoomda...
                                [2, 4], // ...to‘liq chiziq
                            ],
                        }}
                    />
                </Source>
            )}

            {!route_id &&
                points?.map((el, i) => (
                    <Source
                        key={i}
                        cluster={true}
                        clusterMaxZoom={15}
                        clusterRadius={50}
                        data={el}
                        id={`earthquakes_${i}`}
                        type="geojson"
                    >
                        <Layer
                            {...clusterLayer({
                                source: `earthquakes_${i}`,
                                id: i.toString(),
                                color: polygonColors[i],
                            })}
                        />
                        <Layer
                            {...clusterCountLayer({
                                source: `earthquakes_${i}`,
                                id: i.toString(),
                            })}
                        />
                        <Layer
                            {...unclusteredPointLayer({
                                source: `earthquakes_${i}`,
                                id: i.toString(),
                                color: polygonColors[i],
                                hoveredFeatureId,
                            })}
                        />
                        <Layer
                            {...unclusteredPointHitboxLayer({
                                source: `earthquakes_${i}`,
                                id: i.toString(),
                            })}
                        />
                    </Source>
                ))}

            {!route_id &&
                polygons?.map((polygon, i) => (
                    <Source
                        key={`polygon-${i}`}
                        data={polygon}
                        id={`polygon-source-${i}`}
                        type="geojson"
                    >
                        <Layer
                            {...polygonFillLayer(
                                i.toString(),
                                polygonColors[i],
                            )}
                        />
                        <Layer
                            {...polygonLineLayer(
                                i.toString(),
                                polygonColors[i],
                            )}
                        />
                    </Source>
                ))}

            {!route_id &&
                polygons?.map((polygon, i) => (
                    <Marker
                        key={i}
                        anchor="bottom"
                        latitude={
                            getPolygonCentroid(
                                (polygon.features[0]?.geometry as any)
                                    ?.coordinates,
                            ).y
                        }
                        longitude={
                            getPolygonCentroid(
                                (polygon.features[0]?.geometry as any)
                                    ?.coordinates,
                            ).x
                        }
                        className="!z-[1]"
                    >
                        <OfficeTooltip office={polygon.features[0] as Office} />
                    </Marker>
                ))}

            {false && start && (
                <Marker
                    anchor="bottom"
                    latitude={start[1]}
                    longitude={start[0]}
                    className="text-warning -mb-2"
                >
                    {/* <img src="/images/navigation.png" width={36} className="-mb-1" /> */}
                    {/* Start */}
                </Marker>
            )}

            {false && end && (
                <Marker
                    anchor="bottom"
                    latitude={end[1]}
                    longitude={end[0]}
                    className="text-success"
                >
                    <img
                        src="/images/finish.png"
                        width={36}
                        className="-mb-1"
                    />
                </Marker>
            )}

            {activePopup && (
                <CustomPopup
                    lat={activePopup.lngLat[1]}
                    lng={activePopup.lngLat[0]}
                />
            )}
        </Map>
    )
})

export default TestMap
