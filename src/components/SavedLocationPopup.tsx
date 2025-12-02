import { Popup } from 'react-leaflet';

interface SavedLocationPopupProps {
    location: SavedLocation;
    onDelete: (id: string) => void;
}

export const SavedLocationPopup: React.FC<SavedLocationPopupProps> = ({ location, onDelete }) => {
    const handleDelete = () => {
        L.DomEvent.stopPropagation(event as any);
        if (window.confirm(`Tem a certeza que deseja remover "${location.name}"?`)) {
            onDelete(location.date); // Usamos a data como ID único
        }
    };

    return (
        <Popup>
            <b>{location.name}</b>
            <br />
            <small>{new Date(location.date).toLocaleDateString('pt-MZ')}</small>
            <hr style={{margin: '8px 0', borderColor: '#eee'}}/>
            <button className="popup-delete-button" onClick={handleDelete}>
                Remover
            </button>
        </Popup>
    );
};

