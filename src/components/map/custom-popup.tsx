import UserPopup from "@/pages/map/user-popup";
import { Marker } from "react-map-gl/mapbox";

export const CustomPopup = ({ lng, lat }: { lng: number; lat: number }) => (
  <Marker anchor="top-left" latitude={lat} longitude={lng}>
    <div className="pr-2">
      <UserPopup />
    </div>
  </Marker>
);
