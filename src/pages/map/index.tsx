import { MAP_POLYGONS, USER_LOCATIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { useEffect, useMemo, useRef } from "react"
import { MapRef } from "react-map-gl/mapbox"
import MapFilters from "./map-filters"
import { getPolygonCentroid } from "./test-map/util"
import TestMap from "./test-map/test-map"

export default function MapPage() {
    const search = useSearch({ from: "__root__" })

    const { role_id, last_company_id, id } = search

    const { data: companies } = useGet<FeatureCollection>(MAP_POLYGONS)
    const { data: users } = useGet<UserPoint[]>(USER_LOCATIONS, {
        params: { role_id, last_company_id },
    })

    const data: GeoJSON.FeatureCollection[] = useMemo(() => {
        return (
            companies?.features?.map((company) => ({
                type: "FeatureCollection",
                features:
                    users
                        ?.filter((u) => u.company == company.id)
                        ?.map((usr) => ({
                            id: usr.id,
                            type: "Feature",
                            properties: {
                                id: usr.id,
                                name: `Hodim ${usr.id}`,
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [usr.lng, usr.lat],
                            },
                        })) ?? [],
            })) ?? []
        )
    }, [users])

    const ref = useRef<MapRef | null>(null)

    useEffect(() => {
        if (ref.current && search.last_company_id && !id) {
            const officeLoc = companies?.features?.find(
                (comp) => comp.id == search.last_company_id,
            )

            ref?.current.flyTo({
                center: [
                    getPolygonCentroid(
                        officeLoc?.properties.polygon.coordinates ?? [],
                    ).x,
                    getPolygonCentroid(
                        officeLoc?.properties.polygon.coordinates ?? [],
                    ).y,
                ],
                duration: 1000,
                curve: 1.42,
                zoom: 17,
            })
        } else if (ref.current && id) {
            const allFeatures = data.flatMap((d) => d.features || [])
            const user = allFeatures.find((us) => us.id === Number(id))

            if (user) {
                ref?.current.flyTo({
                    center: (user?.geometry as Geometry).coordinates,
                    duration: 1000,
                    curve: 1.42,
                    zoom: 20,
                    essential: true,
                    offset: [-100, -200],
                })
            }
        }
    }, [search, data])

    const convertedPolygons: GeoJSON.FeatureCollection[] =
        companies?.features.map((feature, i) => ({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: feature.properties.polygon,
                    properties: {
                        id: feature.id,
                        name: feature.properties.name,
                        colorIndex: i,
                        lat: feature.geometry.coordinates[0],
                        lon: feature.geometry.coordinates[1],
                        total_count: feature.properties.total_count,
                        exists_count: feature.properties.exists_count,
                        absend_count:
                            feature.properties.total_count -
                            feature.properties.exists_count,
                        persentage:
                            (100 / feature.properties.total_count) *
                            feature.properties.exists_count,
                    },
                },
            ],
        })) ?? []

    const defaultCenter = useMemo(() => {
        if (companies?.features) {
            return {
                latitude: companies?.features[0].geometry.coordinates[0],
                longitude: companies?.features[0].geometry.coordinates[1],
            }
        } else return undefined
    }, [companies])

    return (
        <div className="h-[90%] w-full bottom-0">
            <MapFilters className="mb-3 w-full flex sm:flex-row flex-col items-center gap-3" />
            <TestMap
                ref={ref}
                defaultZoom={17}
                points={data}
                polygons={companies ? convertedPolygons : []}
                defaultCenter={defaultCenter}
            />
        </div>
    )
}
