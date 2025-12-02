import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';

interface Props {
    waypoints: LatLng[];
}

export const Routing: React.FC<Props> = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        // Will do something if there are exactly two points
        if (waypoints.length !== 2) {
            return; 
        }

        // Create Route Controller
        const routingControl = (L as any).Routing.control({
            waypoints,
            routeWhileDragging: false,
            addWaypoints: false,
            lineOptions: { styles: [{ color: '#667eea', opacity: 0.8, weight: 6 }] },
            createMarker: () => null,
        }).addTo(map);

        // Returns the useEffect clearn function
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, waypoints]);

    return null;
};
