import { useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';

type MapMode = 'add' | 'route';

interface Props {
  mode: MapMode;
  onMapClick: (latlng: L.LatLng, mode: MapMode) => void;
}

export const MapEvents: React.FC<Props> = ({ mode, onMapClick }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick(e.latlng, mode);
    },
  });

  return null;
};
