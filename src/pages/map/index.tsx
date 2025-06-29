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

    const { role_id, id } = search

    const { data: companies } = useGet<FeatureCollection>(MAP_POLYGONS)
    const { data: users } = useGet<UserPoint[]>(USER_LOCATIONS)

    const data: GeoJSON.FeatureCollection[] = useMemo(() => {
        return (
            companies?.features?.map((company) => ({
                type: "FeatureCollection",
                features:
                    users
                        ?.filter((u) => {
                            const matchCompany = u.company == company.id
                            const matchRole =
                                role_id ? u.urole_id == role_id : true
                            return matchCompany && matchRole
                        })
                        ?.map((usr) => ({
                            id: usr.id,
                            type: "Feature",
                            properties: {
                                id: usr.id,
                                name: usr.full_name,
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [usr.lng, usr.lat],
                            },
                        })) ?? [],
            })) ?? []
        )
    }, [users, companies, role_id])

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
                essential: true,
            })
        } else if (ref.current && id) {
            const allFeatures = data.flatMap((d) => d.features || [])
            const user = allFeatures.find((us) => us.id === Number(id))

            if (user) {
                ref?.current.flyTo({
                    center: (user?.geometry as Geometry).coordinates,
                    duration: 1000,
                    curve: 1.42,
                    zoom: 17,
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

    return (
        <div className="h-[90%] w-full bottom-0">
            <MapFilters
                users={users}
                className="mb-3 w-full flex sm:flex-row flex-col items-center gap-3"
            />
            {convertedPolygons?.length ?
                <TestMap
                    ref={ref}
                    defaultZoom={16}
                    points={data}
                    polygons={companies ? convertedPolygons : []}
                />
            :   null}
        </div>
    )
}
