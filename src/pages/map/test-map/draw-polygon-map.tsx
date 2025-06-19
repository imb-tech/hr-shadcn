import { MAPBOX_TOKEN } from "@/constants/map"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import { useLocation } from "@tanstack/react-router"
import { Plus, Trash } from "lucide-react"
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
import { useFormContext } from "react-hook-form"
import type { MapRef } from "react-map-gl/mapbox"
import { FullscreenControl, Map } from "react-map-gl/mapbox"
import { MapStyleSwitcher } from "./map-swticher"
import { useTheme } from "@/layouts/theme"
import { cn } from "@/lib/utils"

interface GeoJSONPolygon {
    type: "Polygon"
    coordinates: number[][][]
}

interface DrawEvent {
    features: Array<{
        id: string
        geometry: GeoJSONPolygon
        properties: Record<string, unknown>
    }>
}

type Props = {
    defaultCenter?: { latitude: number; longitude: number }
    defaultZoom?: number
    name: string
    defaultValues?: Office
}

const DrawPolygonMap = forwardRef<MapRef, Props>(
    function DrawPolygonMapComponent(
        {
            defaultCenter = { latitude: 41.20066, longitude: 69.236537 },
            defaultZoom = 12,
            name,
            defaultValues,
        },
        ref,
    ) {
        console.log(defaultCenter)

        const mapRef = useRef<MapRef | null>(null)
        const drawRef = useRef<MapboxDraw | null>(null)
        const [isLoaded, setIsLoaded] = useState<boolean>(false)
        const { theme } = useTheme()
        const [mapStyleId, setMapStyleId] = useState<string>(
            theme === "dark" ? "dark-v11" : "light-v11",
        )
        const location = useLocation()
        const form = useFormContext()
        const [polygonMode, setPolygonMode] = useState<boolean>(true)

        useImperativeHandle(ref, () => mapRef.current as MapRef, [mapRef])

        const handleGetPolygons = useCallback(() => {
            if (!drawRef.current) {
                console.warn("Draw control is not initialized")
                return
            }
            const data = drawRef.current.getAll()
            const coordinates: number[][][] = []

            data?.features?.forEach((feature) => {
                if (feature.geometry.type === "Polygon") {
                    coordinates.push(feature.geometry.coordinates[0])
                }
            })

            form.setValue(name, {
                type: "Polygon",
                coordinates,
            })
            console.log("Form updated with coordinates:", coordinates)
        }, [form, name])

        const deleteSelectedPolygon = useCallback(() => {
            if (!drawRef.current) {
                console.warn("Draw control is not initialized")
                return
            }
            const selected = drawRef.current.getSelected()
            if (selected.features.length > 0) {
                const featureId = selected.features[0].id
                if (featureId) {
                    console.log("Deleting polygon with ID:", featureId)
                    drawRef.current.delete(featureId.toString())
                    handleGetPolygons()
                }
            }
        }, [handleGetPolygons])

        const mode = useMemo(
            () => drawRef.current?.getMode(),
            [drawRef.current, polygonMode],
        )

        console.log(mode)

        const startDrawPolygon = useCallback(() => {
            if (!drawRef.current) {
                console.warn("Draw control is not initialized")
                return
            }
            setPolygonMode(true)
            drawRef.current.changeMode("draw_polygon")
            console.log("Switched to draw_polygon mode")
        }, [])

        useEffect(() => {
            if (!mapRef.current || !isLoaded) return
            const mapboxMap = mapRef.current.getMap()

            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: false,
                    trash: false,
                },
                defaultMode: "draw_polygon",
            })

            const geolocateControl = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            })

            mapboxMap.addControl(geolocateControl)
            geolocateControl.trigger()

            mapboxMap.addControl(drawRef.current)

            mapboxMap.on("draw.create", (e: DrawEvent) => {
                console.log("Polygon created:", e.features)
                handleGetPolygons()
            })
            mapboxMap.on("draw.update", (e: DrawEvent) => {
                console.log("Polygon updated:", e.features)
                handleGetPolygons()
                setPolygonMode(false)
            })
            mapboxMap.on("draw.delete", (e: DrawEvent) => {
                console.log("Polygon deleted:", e.features)
                handleGetPolygons()
                setPolygonMode(false)
            })

            mapboxMap.on("draw.selectionchange", (e: DrawEvent) => {
                if (e.features.length > 0 && drawRef.current) {
                    let featureId = e.features[0].id
                    if (!featureId) {
                        featureId = `polygon-${Date.now()}`
                        e.features[0].id = featureId
                        drawRef.current.deleteAll()
                        drawRef.current.add(e.features[0] as GeoJSON.Feature)
                    }
                    drawRef.current.changeMode("direct_select", { featureId })
                    setPolygonMode(false)
                }
            })

            return () => {
                if (drawRef.current && mapRef.current) {
                    mapboxMap.removeControl(drawRef.current)
                    mapRef.current.removeControl(geolocateControl)
                }
            }
        }, [isLoaded, handleGetPolygons])

        useEffect(() => {
            if (!drawRef.current || !isLoaded || !defaultValues) return

            if (location.pathname.startsWith("/office-edit")) {
                const featureId = defaultValues.id || `polygon-${Date.now()}`
                console.log(
                    "Loading default polygon with ID:",
                    featureId,
                    "Default values:",
                    defaultValues,
                )
                const feature = {
                    type: "Feature" as const,
                    id: featureId,
                    geometry: defaultValues.properties.polygon,
                    properties: {},
                }
                try {
                    drawRef.current?.add(feature)
                    drawRef.current?.changeMode("direct_select" as any, {
                        featureId,
                    })
                    handleGetPolygons()
                } catch (error) {
                    console.error("Error loading default polygon:", error)
                }
            }
        }, [isLoaded, defaultValues, location.pathname, handleGetPolygons])

        return (
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: defaultCenter.latitude,
                    longitude: defaultCenter.longitude,
                    zoom: defaultZoom,
                }}
                mapStyle={`mapbox://styles/mapbox/${mapStyleId}`}
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ height: 500, borderRadius: 10, position: "relative" }}
                onLoad={() => setIsLoaded(true)}
            >
                <FullscreenControl
                    position="top-right"
                    style={{ marginTop: 10 }}
                />
                <MapStyleSwitcher
                    initial={theme === "dark" ? "dark-v11" : "light-v11"}
                    onChange={(id) => setMapStyleId(id)}
                />
                <button
                    onClick={deleteSelectedPolygon}
                    className={cn(
                        "h-7 w-7 flex items-center justify-center rounded absolute bg-white text-black right-[10px] top-[88px] !cursor-pointer",
                    )}
                    type="button"
                >
                    <Trash size={18} />
                </button>
                <button
                    onClick={startDrawPolygon}
                    className={cn(
                        "h-7 w-7 flex items-center justify-center rounded absolute bg-white text-black right-[10px] top-[124px] !cursor-pointer",
                        polygonMode ? "bg-primary-500 text-white" : "",
                    )}
                    type="button"
                >
                    <Plus size={18} />
                </button>
            </Map>
        )
    },
)

export default DrawPolygonMap
