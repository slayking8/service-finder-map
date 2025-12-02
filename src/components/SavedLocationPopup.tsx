import { Popup } from 'react-leaflet';

interface SavedLocationPopupProps {
    location: SavedLocation;
    onDelete: (id: string) => void;
    onRoute: (location: SavedLocation) => void;
}

export const SavedLocationPopup: React.FC<SavedLocationPopupProps> = ({ location, onDelete, onRoute }) => {
    const handleDelete = () => {
        L.DomEvent.stopPropagation(event as any);
        if (window.confirm(`Tem a certeza que deseja remover "${location.name}"?`)) {
            onDelete(location.date); // Using the date as a unique ID
        }
    };

    const handleRouteClick = (event: React.MouseEvent) => {
        L.DomEvent.stopPropagation(event as any);
        onRoute(location);
    };

    return (
        <Popup>
            <b>{location.name}</b>
            <br />
            <small>{new Date(location.date).toLocaleDateString('pt-MZ')}</small>
            <hr style={{margin: '8px 0', borderColor: '#eee'}}/>
            <button className="popup-action-button" onClick={handleRouteClick}>
                Ver Rota
            </button>
            <button className="popup-delete-button" onClick={handleDelete}>
                Remover
            </button>
        </Popup>
    );
};

